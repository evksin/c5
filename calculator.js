class Calculator {
  constructor() {
    this.currentInput = "0";
    this.shouldResetDisplay = false;
  }

  getCurrentInput() {
    return this.currentInput;
  }

  appendNumber(number) {
    if (this.shouldResetDisplay) {
      this.currentInput = "0";
      this.shouldResetDisplay = false;
    }

    if (this.currentInput === "0") {
      this.currentInput = number;
    } else {
      this.currentInput += number;
    }
  }

  appendDecimal() {
    if (this.shouldResetDisplay) {
      this.currentInput = "0";
      this.shouldResetDisplay = false;
    }

    const lastChar = this.currentInput[this.currentInput.length - 1];

    // Не добавляем точку, если последний символ уже точка
    if (lastChar === ".") {
      return;
    }

    // Если последний символ - оператор, можно добавить точку (для ввода 0.число)
    if (["+", "-", "*", "/"].includes(lastChar)) {
      this.currentInput += ".";
      return;
    }

    // Находим последний оператор
    const lastOperatorIndex = Math.max(
      this.currentInput.lastIndexOf("+"),
      this.currentInput.lastIndexOf("-"),
      this.currentInput.lastIndexOf("*"),
      this.currentInput.lastIndexOf("/")
    );

    // Получаем текущее число (часть после последнего оператора)
    const currentNumber =
      lastOperatorIndex >= 0
        ? this.currentInput.substring(lastOperatorIndex + 1)
        : this.currentInput;

    // Проверяем, есть ли точка только в текущем числе
    if (!currentNumber.includes(".")) {
      this.currentInput += ".";
    }
  }

  appendOperator(operator) {
    if (this.shouldResetDisplay) {
      this.shouldResetDisplay = false;
    }

    const lastChar = this.currentInput[this.currentInput.length - 1];
    if (["+", "-", "*", "/"].includes(lastChar)) {
      this.currentInput = this.currentInput.slice(0, -1) + operator;
    } else {
      this.currentInput += operator;
    }
  }

  calculate() {
    try {
      // Заменяем × на * для вычисления
      let expression = this.currentInput.replace(/×/g, "*");

      // Проверяем на деление на ноль
      if (expression.includes("/0") && !expression.includes("/0.")) {
        this.currentInput = "Ошибка";
        this.shouldResetDisplay = true;
        return "Ошибка";
      }

      const result = Function('"use strict"; return (' + expression + ")")();

      if (isNaN(result) || !isFinite(result)) {
        this.currentInput = "Ошибка";
        this.shouldResetDisplay = true;
        return "Ошибка";
      } else {
        this.currentInput = result.toString();
        this.shouldResetDisplay = true;
        return this.currentInput;
      }
    } catch (error) {
      this.currentInput = "Ошибка";
      this.shouldResetDisplay = true;
      return "Ошибка";
    }
  }

  clearDisplay() {
    this.currentInput = "0";
    this.shouldResetDisplay = false;
  }

  deleteLast() {
    if (this.shouldResetDisplay) {
      this.clearDisplay();
      return;
    }

    if (this.currentInput.length > 1) {
      this.currentInput = this.currentInput.slice(0, -1);
    } else {
      this.currentInput = "0";
    }
  }
}

export default Calculator;
