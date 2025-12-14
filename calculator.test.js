import { describe, it, expect, beforeEach } from "vitest";
import Calculator from "./calculator.js";

describe("Calculator", () => {
  let calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  describe("Конструктор и начальное состояние", () => {
    it('должен инициализироваться с currentInput = "0"', () => {
      expect(calculator.getCurrentInput()).toBe("0");
    });

    it("должен инициализироваться с shouldResetDisplay = false", () => {
      expect(calculator.shouldResetDisplay).toBe(false);
    });
  });

  describe("appendNumber", () => {
    it("должен добавить число к текущему вводу", () => {
      calculator.appendNumber("5");
      expect(calculator.getCurrentInput()).toBe("5");
    });

    it('должен заменить "0" на новое число', () => {
      calculator.appendNumber("7");
      expect(calculator.getCurrentInput()).toBe("7");
    });

    it("должен добавить число к существующему вводу", () => {
      calculator.appendNumber("1");
      calculator.appendNumber("2");
      calculator.appendNumber("3");
      expect(calculator.getCurrentInput()).toBe("123");
    });

    it("должен сбросить ввод, если shouldResetDisplay = true", () => {
      calculator.appendNumber("5");
      calculator.calculate();
      calculator.appendNumber("3");
      expect(calculator.getCurrentInput()).toBe("3");
    });

    it("должен обрабатывать несколько последовательных чисел", () => {
      calculator.appendNumber("1");
      calculator.appendNumber("2");
      calculator.appendNumber("3");
      calculator.appendNumber("4");
      expect(calculator.getCurrentInput()).toBe("1234");
    });

    it("должен обрабатывать ноль после других чисел", () => {
      calculator.appendNumber("1");
      calculator.appendNumber("0");
      expect(calculator.getCurrentInput()).toBe("10");
    });
  });

  describe("appendDecimal", () => {
    it("должен добавить десятичную точку к числу", () => {
      calculator.appendNumber("5");
      calculator.appendDecimal();
      expect(calculator.getCurrentInput()).toBe("5.");
    });

    it('должен добавить десятичную точку к "0"', () => {
      calculator.appendDecimal();
      expect(calculator.getCurrentInput()).toBe("0.");
    });

    it("не должен добавлять вторую десятичную точку", () => {
      calculator.appendNumber("5");
      calculator.appendDecimal();
      calculator.appendDecimal();
      expect(calculator.getCurrentInput()).toBe("5.");
    });

    it("должен сбросить ввод, если shouldResetDisplay = true", () => {
      calculator.appendNumber("5");
      calculator.calculate();
      calculator.appendDecimal();
      expect(calculator.getCurrentInput()).toBe("0.");
    });

    it("должен работать с числами после оператора", () => {
      calculator.appendNumber("5");
      calculator.appendOperator("+");
      calculator.appendDecimal();
      expect(calculator.getCurrentInput()).toBe("5+.");
    });
  });

  describe("appendOperator", () => {
    it("должен добавить оператор к числу", () => {
      calculator.appendNumber("5");
      calculator.appendOperator("+");
      expect(calculator.getCurrentInput()).toBe("5+");
    });

    it("должен заменить существующий оператор новым", () => {
      calculator.appendNumber("5");
      calculator.appendOperator("+");
      calculator.appendOperator("-");
      expect(calculator.getCurrentInput()).toBe("5-");
    });

    it("должен обрабатывать все операторы", () => {
      calculator.appendNumber("5");
      calculator.appendOperator("+");
      expect(calculator.getCurrentInput()).toBe("5+");

      calculator.appendNumber("3");
      calculator.appendOperator("-");
      expect(calculator.getCurrentInput()).toBe("5+3-");

      calculator.appendNumber("2");
      calculator.appendOperator("*");
      expect(calculator.getCurrentInput()).toBe("5+3-2*");

      calculator.appendNumber("1");
      calculator.appendOperator("/");
      expect(calculator.getCurrentInput()).toBe("5+3-2*1/");
    });

    it("должен сбросить флаг shouldResetDisplay", () => {
      calculator.appendNumber("5");
      calculator.calculate();
      calculator.appendOperator("+");
      expect(calculator.shouldResetDisplay).toBe(false);
    });

    it("должен обрабатывать несколько операторов подряд", () => {
      calculator.appendNumber("5");
      calculator.appendOperator("+");
      calculator.appendOperator("-");
      calculator.appendOperator("*");
      expect(calculator.getCurrentInput()).toBe("5*");
    });
  });

  describe("calculate", () => {
    describe("Положительные сценарии", () => {
      it("должен выполнить простое сложение", () => {
        calculator.appendNumber("5");
        calculator.appendOperator("+");
        calculator.appendNumber("3");
        const result = calculator.calculate();
        expect(result).toBe("8");
        expect(calculator.getCurrentInput()).toBe("8");
      });

      it("должен выполнить вычитание", () => {
        calculator.appendNumber("10");
        calculator.appendOperator("-");
        calculator.appendNumber("3");
        const result = calculator.calculate();
        expect(result).toBe("7");
      });

      it("должен выполнить умножение", () => {
        calculator.appendNumber("5");
        calculator.appendOperator("*");
        calculator.appendNumber("4");
        const result = calculator.calculate();
        expect(result).toBe("20");
      });

      it("должен выполнить деление", () => {
        calculator.appendNumber("10");
        calculator.appendOperator("/");
        calculator.appendNumber("2");
        const result = calculator.calculate();
        expect(result).toBe("5");
      });

      it("должен выполнить сложное выражение", () => {
        calculator.appendNumber("5");
        calculator.appendOperator("+");
        calculator.appendNumber("3");
        calculator.appendOperator("*");
        calculator.appendNumber("2");
        const result = calculator.calculate();
        expect(result).toBe("11");
      });

      it("должен обрабатывать десятичные числа", () => {
        calculator.appendNumber("5");
        calculator.appendDecimal();
        calculator.appendNumber("5");
        calculator.appendOperator("+");
        calculator.appendNumber("2");
        calculator.appendDecimal();
        calculator.appendNumber("5");
        const result = calculator.calculate();
        expect(result).toBe("8");
      });

      it("должен обрабатывать отрицательные результаты", () => {
        calculator.appendNumber("5");
        calculator.appendOperator("-");
        calculator.appendNumber("10");
        const result = calculator.calculate();
        expect(result).toBe("-5");
      });

      it("должен обрабатывать деление с остатком", () => {
        calculator.appendNumber("7");
        calculator.appendOperator("/");
        calculator.appendNumber("3");
        const result = calculator.calculate();
        expect(parseFloat(result)).toBeCloseTo(2.333333333333333, 10);
      });

      it("должен установить shouldResetDisplay в true после вычисления", () => {
        calculator.appendNumber("5");
        calculator.appendOperator("+");
        calculator.appendNumber("3");
        calculator.calculate();
        expect(calculator.shouldResetDisplay).toBe(true);
      });
    });

    describe("Отрицательные сценарии и деление на ноль", () => {
      it('должен вернуть "Ошибка" при делении на ноль', () => {
        calculator.appendNumber("10");
        calculator.appendOperator("/");
        calculator.appendNumber("0");
        const result = calculator.calculate();
        expect(result).toBe("Ошибка");
        expect(calculator.getCurrentInput()).toBe("Ошибка");
      });

      it('должен вернуть "Ошибка" при делении на ноль в сложном выражении', () => {
        calculator.appendNumber("5");
        calculator.appendOperator("+");
        calculator.appendNumber("3");
        calculator.appendOperator("/");
        calculator.appendNumber("0");
        const result = calculator.calculate();
        expect(result).toBe("Ошибка");
      });

      it("не должен считать деление на 0.0 как ошибку", () => {
        calculator.appendNumber("10");
        calculator.appendOperator("/");
        calculator.appendNumber("0");
        calculator.appendDecimal();
        calculator.appendNumber("5");
        const result = calculator.calculate();
        expect(result).not.toBe("Ошибка");
        expect(parseFloat(result)).toBeCloseTo(20, 5);
      });

      it('должен вернуть "Ошибка" при невалидном выражении', () => {
        calculator.currentInput = "5++";
        const result = calculator.calculate();
        expect(result).toBe("Ошибка");
      });

      it('должен вернуть "Ошибка" при пустом выражении', () => {
        calculator.currentInput = "";
        const result = calculator.calculate();
        expect(result).toBe("Ошибка");
      });

      it('должен вернуть "Ошибка" при только операторе', () => {
        calculator.currentInput = "+";
        const result = calculator.calculate();
        expect(result).toBe("Ошибка");
      });

      it("должен обрабатывать деление на ноль в начале выражения", () => {
        calculator.appendNumber("0");
        calculator.appendOperator("/");
        calculator.appendNumber("5");
        const result = calculator.calculate();
        expect(result).toBe("0");
      });
    });
  });

  describe("clearDisplay", () => {
    it('должен сбросить currentInput в "0"', () => {
      calculator.appendNumber("123");
      calculator.clearDisplay();
      expect(calculator.getCurrentInput()).toBe("0");
    });

    it("должен сбросить shouldResetDisplay в false", () => {
      calculator.appendNumber("5");
      calculator.calculate();
      calculator.clearDisplay();
      expect(calculator.shouldResetDisplay).toBe(false);
    });

    it("должен работать после вычисления", () => {
      calculator.appendNumber("5");
      calculator.appendOperator("+");
      calculator.appendNumber("3");
      calculator.calculate();
      calculator.clearDisplay();
      expect(calculator.getCurrentInput()).toBe("0");
      expect(calculator.shouldResetDisplay).toBe(false);
    });

    it("должен работать после ошибки", () => {
      calculator.appendNumber("5");
      calculator.appendOperator("/");
      calculator.appendNumber("0");
      calculator.calculate();
      calculator.clearDisplay();
      expect(calculator.getCurrentInput()).toBe("0");
    });
  });

  describe("deleteLast", () => {
    it("должен удалить последний символ", () => {
      calculator.appendNumber("123");
      calculator.deleteLast();
      expect(calculator.getCurrentInput()).toBe("12");
    });

    it("должен удалить несколько символов подряд", () => {
      calculator.appendNumber("123");
      calculator.deleteLast();
      calculator.deleteLast();
      expect(calculator.getCurrentInput()).toBe("1");
    });

    it('должен установить "0", если остался один символ', () => {
      calculator.appendNumber("5");
      calculator.deleteLast();
      expect(calculator.getCurrentInput()).toBe("0");
    });

    it('не должен удалять последний символ, если это "0"', () => {
      calculator.deleteLast();
      expect(calculator.getCurrentInput()).toBe("0");
    });

    it("должен удалить оператор", () => {
      calculator.appendNumber("5");
      calculator.appendOperator("+");
      calculator.deleteLast();
      expect(calculator.getCurrentInput()).toBe("5");
    });

    it("должен вызвать clearDisplay, если shouldResetDisplay = true", () => {
      calculator.appendNumber("5");
      calculator.calculate();
      calculator.deleteLast();
      expect(calculator.getCurrentInput()).toBe("0");
      expect(calculator.shouldResetDisplay).toBe(false);
    });

    it("должен работать с десятичными числами", () => {
      calculator.appendNumber("5");
      calculator.appendDecimal();
      calculator.appendNumber("5");
      calculator.deleteLast();
      expect(calculator.getCurrentInput()).toBe("5.");
    });
  });

  describe("Интеграционные тесты", () => {
    it("должен выполнить полную последовательность операций", () => {
      calculator.appendNumber("1");
      calculator.appendNumber("0");
      calculator.appendOperator("+");
      calculator.appendNumber("5");
      calculator.appendOperator("*");
      calculator.appendNumber("2");
      const result = calculator.calculate();
      expect(result).toBe("20");
    });

    it("должен обрабатывать цепочку вычислений", () => {
      calculator.appendNumber("5");
      calculator.appendOperator("+");
      calculator.appendNumber("3");
      calculator.calculate();

      calculator.appendOperator("*");
      calculator.appendNumber("2");
      calculator.calculate();

      expect(calculator.getCurrentInput()).toBe("16");
    });

    it("должен обрабатывать сложное выражение с приоритетами", () => {
      calculator.appendNumber("2");
      calculator.appendOperator("+");
      calculator.appendNumber("3");
      calculator.appendOperator("*");
      calculator.appendNumber("4");
      calculator.appendOperator("-");
      calculator.appendNumber("1");
      const result = calculator.calculate();
      expect(result).toBe("13");
    });
  });
});
