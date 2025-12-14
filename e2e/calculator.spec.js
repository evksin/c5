import { test, expect } from "@playwright/test";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const calculatorPath = `file://${resolve(__dirname, "../calculator.html")}`;

test.describe("Калькулятор - E2E тесты", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(calculatorPath);
    await expect(page.locator("#display")).toHaveText("0");
  });

  test("должен отображать начальное значение 0", async ({ page }) => {
    const display = page.locator("#display");
    await expect(display).toHaveText("0");
  });

  test("должен вводить числа", async ({ page }) => {
    const display = page.locator("#display");

    // Ввод числа 5
    await page.click('button:has-text("5")');
    await expect(display).toHaveText("5");

    // Ввод числа 3
    await page.click('button:has-text("3")');
    await expect(display).toHaveText("53");

    // Ввод числа 7
    await page.click('button:has-text("7")');
    await expect(display).toHaveText("537");
  });

  test("должен выполнять простое сложение", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("5")');
    await page.click('button.operator:has-text("+")');
    await page.click('button:has-text("3")');
    await page.click('button.equals:has-text("=")');

    await expect(display).toHaveText("8");
  });

  test("должен выполнять вычитание", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("1")');
    await page.click('button:has-text("0")');
    await page.click('button.operator:has-text("-")');
    await page.click('button:has-text("3")');
    await page.click('button.equals:has-text("=")');

    await expect(display).toHaveText("7");
  });

  test("должен выполнять умножение", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("5")');
    await page.click('button.operator:has-text("×")');
    await page.click('button:has-text("4")');
    await page.click('button.equals:has-text("=")');

    await expect(display).toHaveText("20");
  });

  test("должен выполнять деление", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("1")');
    await page.click('button:has-text("0")');
    await page.click('button.operator:has-text("/")');
    await page.click('button:has-text("2")');
    await page.click('button.equals:has-text("=")');

    await expect(display).toHaveText("5");
  });

  test("должен обрабатывать десятичные числа", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("5")');
    await page.click('button:has-text(".")');
    await page.click('button:has-text("5")');
    await page.click('button.operator:has-text("+")');
    await page.click('button:has-text("2")');
    await page.click('button:has-text(".")');
    await page.click('button:has-text("5")');
    await page.click('button.equals:has-text("=")');

    await expect(display).toHaveText("8");
  });

  test("должен обрабатывать деление на ноль", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("1")');
    await page.click('button:has-text("0")');
    await page.click('button.operator:has-text("/")');
    await page.click('button:has-text("0")');
    await page.click('button.equals:has-text("=")');

    await expect(display).toHaveText("Ошибка");
  });

  test("должен очищать дисплей", async ({ page }) => {
    const display = page.locator("#display");

    // Вводим число
    await page.click('button:has-text("1")');
    await page.click('button:has-text("2")');
    await page.click('button:has-text("3")');
    await expect(display).toHaveText("123");

    // Очищаем
    await page.click('button.clear:has-text("C")');
    await expect(display).toHaveText("0");
  });

  test("должен удалять последний символ", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("1")');
    await page.click('button:has-text("2")');
    await page.click('button:has-text("3")');
    await expect(display).toHaveText("123");

    await page.click('button.operator:has-text("⌫")');
    await expect(display).toHaveText("12");

    await page.click('button.operator:has-text("⌫")');
    await expect(display).toHaveText("1");

    await page.click('button.operator:has-text("⌫")');
    await expect(display).toHaveText("0");
  });

  test("должен выполнять сложное выражение", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("5")');
    await page.click('button.operator:has-text("+")');
    await page.click('button:has-text("3")');
    await page.click('button.operator:has-text("×")');
    await page.click('button:has-text("2")');
    await page.click('button.equals:has-text("=")');

    await expect(display).toHaveText("11");
  });

  test("должен заменять оператор при повторном нажатии", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("5")');
    await page.click('button.operator:has-text("+")');
    await expect(display).toHaveText("5+");

    await page.click('button.operator:has-text("-")');
    await expect(display).toHaveText("5-");
  });

  test("должен обрабатывать отрицательные результаты", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("5")');
    await page.click('button.operator:has-text("-")');
    await page.click('button:has-text("1")');
    await page.click('button:has-text("0")');
    await page.click('button.equals:has-text("=")');

    await expect(display).toHaveText("-5");
  });

  test("должен обрабатывать цепочку вычислений", async ({ page }) => {
    const display = page.locator("#display");

    // Первое вычисление: 5 + 3 = 8
    await page.click('button:has-text("5")');
    await page.click('button.operator:has-text("+")');
    await page.click('button:has-text("3")');
    await page.click('button.equals:has-text("=")');
    await expect(display).toHaveText("8");

    // Второе вычисление: 8 * 2 = 16
    await page.click('button.operator:has-text("×")');
    await page.click('button:has-text("2")');
    await page.click('button.equals:has-text("=")');
    await expect(display).toHaveText("16");
  });

  test("должен обрабатывать ввод после вычисления", async ({ page }) => {
    const display = page.locator("#display");

    // Вычисляем 5 + 3 = 8
    await page.click('button:has-text("5")');
    await page.click('button.operator:has-text("+")');
    await page.click('button:has-text("3")');
    await page.click('button.equals:has-text("=")');
    await expect(display).toHaveText("8");

    // Вводим новое число (должно заменить результат)
    await page.click('button:has-text("9")');
    await expect(display).toHaveText("9");
  });

  test("должен обрабатывать деление с остатком", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("7")');
    await page.click('button.operator:has-text("/")');
    await page.click('button:has-text("3")');
    await page.click('button.equals:has-text("=")');

    const result = await display.textContent();
    const numResult = parseFloat(result);
    expect(numResult).toBeCloseTo(2.333333333333333, 10);
  });

  test("должен обрабатывать ввод нуля", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("0")');
    await expect(display).toHaveText("0");

    // Ноль должен замениться при вводе другого числа
    await page.click('button:has-text("5")');
    await expect(display).toHaveText("5");
  });

  test("должен обрабатывать ввод нескольких нулей", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("1")');
    await page.click('button:has-text("0")');
    await page.click('button:has-text("0")');
    await expect(display).toHaveText("100");
  });

  test("должен обрабатывать десятичную точку после оператора", async ({
    page,
  }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("5")');
    await page.click('button.operator:has-text("+")');
    await page.click('button:has-text(".")');
    await expect(display).toHaveText("5+.");

    await page.click('button:has-text("5")');
    await expect(display).toHaveText("5+.5");
  });

  test("не должен добавлять вторую десятичную точку в одном числе", async ({
    page,
  }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("5")');
    await page.click('button:has-text(".")');
    await page.click('button:has-text("5")');
    await page.click('button:has-text(".")'); // Вторая точка не должна добавиться
    await expect(display).toHaveText("5.5");
  });

  test("должен обрабатывать клавиатурный ввод", async ({ page }) => {
    const display = page.locator("#display");

    await page.keyboard.press("5");
    await expect(display).toHaveText("5");

    await page.keyboard.press("+");
    await expect(display).toHaveText("5+");

    await page.keyboard.press("3");
    await expect(display).toHaveText("5+3");

    await page.keyboard.press("Enter");
    await expect(display).toHaveText("8");
  });

  test("должен обрабатывать клавишу Escape для очистки", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("1")');
    await page.click('button:has-text("2")');
    await page.click('button:has-text("3")');
    await expect(display).toHaveText("123");

    await page.keyboard.press("Escape");
    await expect(display).toHaveText("0");
  });

  test("должен обрабатывать клавишу Backspace", async ({ page }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("1")');
    await page.click('button:has-text("2")');
    await page.click('button:has-text("3")');
    await expect(display).toHaveText("123");

    await page.keyboard.press("Backspace");
    await expect(display).toHaveText("12");
  });

  test("должен обрабатывать сложное выражение с приоритетами", async ({
    page,
  }) => {
    const display = page.locator("#display");

    await page.click('button:has-text("2")');
    await page.click('button.operator:has-text("+")');
    await page.click('button:has-text("3")');
    await page.click('button.operator:has-text("×")');
    await page.click('button:has-text("4")');
    await page.click('button.operator:has-text("-")');
    await page.click('button:has-text("1")');
    await page.click('button.equals:has-text("=")');

    await expect(display).toHaveText("13");
  });
});
