const calculatorValues = {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    operator: null
};

function inputDigit(digit) {
    const { displayValue, waitingForSecondOperand } = calculatorValues;

    if (waitingForSecondOperand === true) {
        calculatorValues.displayValue = digit;
        calculatorValues.waitingForSecondOperand = false;
    }
    else {
        calculatorValues.displayValue = (displayValue === '0') ? digit : displayValue + digit;
    }
}

function inputDecimal(dot) {
    if (calculatorValues.waitingForSecondOperand === true) {
        calculatorValues.displayValue = '0';
        calculatorValues.waitingForSecondOperand = false;
        return;
    }

    if (!calculatorValues.displayValue.includes(dot)) {
        calculatorValues.displayValue += dot;
    }
}

function handleOperator(nextOperator) {
    const { firstOperand, displayValue, operator } = calculatorValues;
    const inputValue = parseFloat(displayValue);

    if (operator && calculatorValues.waitingForSecondOperand) {
        calculatorValues.operator = nextOperator;
        return;
    }

    if (firstOperand == null && !isNaN(inputValue)) {
        calculatorValues.firstOperand = inputValue;
    } else if (operator) {
        const result = calculate(firstOperand, inputValue, operator);

        calculatorValues.displayValue = String(result);
        calculatorValues.firstOperand = result;
    }

    calculatorValues.waitingForSecondOperand = true;
    calculatorValues.operator = nextOperator;
}

function calculate(firstOperand, secondOperand, operator) {
    if (operator === '+') {
        return firstOperand + secondOperand;
    } else if (operator === '-') {
        return firstOperand - secondOperand;
    } else if (operator === '*') {
        return firstOperand * secondOperand;
    } else if (operator === '/') {
        return firstOperand / secondOperand;
    }

    return secondOperand;
}

function resetCalculator() {
    calculatorValues.displayValue = '0';
    calculatorValues.firstOperand = null;
    calculatorValues.waitingForSecondOperand = true;
    calculatorValues.operator = null;
}

function updateDisplay() {
    const display = document.querySelector('.calculator-screen');
    display.value = calculatorValues.displayValue;
}

updateDisplay();

const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', event => {
    const { target } = event;
    const { value } = target;

    if (!target.matches('button')) return;

    switch (value) {
        case '+':
        case '-':
        case '*':
        case '/':
        case '=':
            handleOperator(value);
            break;
        case '.':
            inputDecimal(value);
            break;
        case 'all-clear':
            resetCalculator();
            break;
        default:
            if (Number.isInteger(parseFloat(value))) {
                inputDigit(value);
            }
    }
    updateDisplay();
});