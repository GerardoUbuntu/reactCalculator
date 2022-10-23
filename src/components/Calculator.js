import React, { useState, useEffect, useCallback } from 'react';
import CalculatorDisplay from './CalculatorDisplay';
import CalculatorKey from './CalculatorKey';
import CalculatorOperations from '../util/CalculatorOperations';

export default function Calculator() {
  const [status, setStatus] = useState({
    value: null,
    displayValue: '0',
    operator: null,
    waitingForOperand: false,
  });

  function clearAll() {
    setStatus({
      value: null,
      displayValue: '0',
      operator: null,
      waitingForOperand: false,
    });
  }

  function clearDisplay() {
    setStatus({
      ...status,
      displayValue: '0',
    });
  }

  function clearLastChar() {
    setStatus({
      ...status,
      displayValue: status.displayValue.substring(0, status.displayValue.length - 1) || '0',
    });
  }

  function toggleSign() {
    const newValue = parseFloat(status.displayValue) * -1;

    setStatus({
      ...status,
      displayValue: String(newValue),
    });
  }

  function inputPercent() {
    const currentValue = parseFloat(status.displayValue);

    if (currentValue === 0) return;

    const fixedDigits = status.displayValue.replace(/^-?\d*\.?/, '');
    const newValue = parseFloat(status.displayValue) / 100;

    setStatus({
      ...status,
      displayValue: String(newValue.toFixed(fixedDigits.length + 2)),
    });
  }

  function inputDot() {
    if (!/\./.test(status.displayValue)) {
      setStatus({
        ...status,
        displayValue: status.displayValue + '.',
        waitingForOperand: false,
      });
    }
  }

  function performOperation(nextOperator) {
    const inputValue = parseFloat(status.displayValue);
    if (status.value == null) {
      setStatus({
        ...status,
        value: inputValue,
        waitingForOperand: true,
        operator: nextOperator,
      });
    } else if (status.operator) {
      const currentValue = status.value || 0;
      const newValue = CalculatorOperations[status.operator](currentValue, inputValue);

      setStatus({
        ...status,
        value: newValue,
        displayValue: String(newValue),
        waitingForOperand: true,
        operator: nextOperator,
      });
    } else {
      setStatus({
        ...status,
        waitingForOperand: true,
        operator: nextOperator,
      });
    }
  }

  function inputDigit(digit) {
    if (status.waitingForOperand) {
      setStatus({
        ...status,
        displayValue: String(digit),
        waitingForOperand: false,
      });
    } else {
      setStatus({
        ...status,
        displayValue: status.displayValue === '0' ? String(digit) : status.displayValue + digit,
      });
    }
  }

  const handleKeyDown = useCallback(
    (event) => {
      let { key } = event;

      if (key === 'Enter') key = '=';

      if (/\d/.test(key)) {
        event.preventDefault();
        inputDigit(parseInt(key, 10));
      } else if (key in CalculatorOperations) {
        event.preventDefault();
        performOperation(key);
      } else if (key === '.') {
        event.preventDefault();
        inputDot();
      } else if (key === '%') {
        event.preventDefault();
        inputPercent();
      } else if (key === 'Backspace') {
        event.preventDefault();
        clearLastChar();
      } else if (key === 'Clear') {
        event.preventDefault();

        if (status.displayValue !== '0') {
          clearDisplay();
        } else {
          clearAll();
        }
      }
    },
    [status.displayValue, inputDigit]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const isClearDisplay = status.displayValue !== '0';
  const clearText = isClearDisplay ? 'C' : 'AC';

  return (
    <div className="calculator">
      <CalculatorDisplay value={status.displayValue} />
      <div className="calculator-keypad">
        <div className="input-keys">
          <div className="function-keys">
            <CalculatorKey
              className="key-clear"
              onPress={() => (isClearDisplay ? clearDisplay() : clearAll())}
            >
              {clearText}
            </CalculatorKey>
            <CalculatorKey className="key-sign" onPress={() => toggleSign()}>
              ±
            </CalculatorKey>
            <CalculatorKey className="key-percent" onPress={() => inputPercent()}>
              %
            </CalculatorKey>
          </div>
          <div className="digit-keys">
            <CalculatorKey className="key-0" onPress={() => inputDigit(0)}>
              0
            </CalculatorKey>
            <CalculatorKey className="key-dot" onPress={() => inputDot()}>
              ●
            </CalculatorKey>
            <CalculatorKey className="key-1" onPress={() => inputDigit(1)}>
              1
            </CalculatorKey>
            <CalculatorKey className="key-2" onPress={() => inputDigit(2)}>
              2
            </CalculatorKey>
            <CalculatorKey className="key-3" onPress={() => inputDigit(3)}>
              3
            </CalculatorKey>
            <CalculatorKey className="key-4" onPress={() => inputDigit(4)}>
              4
            </CalculatorKey>
            <CalculatorKey className="key-5" onPress={() => inputDigit(5)}>
              5
            </CalculatorKey>
            <CalculatorKey className="key-6" onPress={() => inputDigit(6)}>
              6
            </CalculatorKey>
            <CalculatorKey className="key-7" onPress={() => inputDigit(7)}>
              7
            </CalculatorKey>
            <CalculatorKey className="key-8" onPress={() => inputDigit(8)}>
              8
            </CalculatorKey>
            <CalculatorKey className="key-9" onPress={() => inputDigit(9)}>
              9
            </CalculatorKey>
          </div>
        </div>
        <div className="operator-keys">
          <CalculatorKey className="key-divide" onPress={() => performOperation('/')}>
            ÷
          </CalculatorKey>
          <CalculatorKey className="key-multiply" onPress={() => performOperation('*')}>
            ×
          </CalculatorKey>
          <CalculatorKey className="key-subtract" onPress={() => performOperation('-')}>
            −
          </CalculatorKey>
          <CalculatorKey className="key-add" onPress={() => performOperation('+')}>
            +
          </CalculatorKey>
          <CalculatorKey className="key-equals" onPress={() => performOperation('=')}>
            =
          </CalculatorKey>
        </div>
      </div>
    </div>
  );
}
