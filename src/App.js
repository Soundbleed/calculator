import './App.css';
import { useState } from 'react';

function App() {

  const [currentInput, setCurrentInput] = useState('');
  const [previousInput, setPreviousInput] = useState('');
  const [operator, setOperator] = useState('');
  const [result, setResult] = useState(0);
  const [history, setHistory] = useState('');
  const [isResultDisplayed, setIsResultDisplayed] = useState(false);

  const handleNumberClick = (value) => {
    if (isResultDisplayed) {
      // Reset current input and start a new calculation
      setCurrentInput(value);
      setHistory(value);
      setResult(0)
      setIsResultDisplayed(false);  // We are no longer in the result view
    }
    else {
      if (currentInput === '0' && value === '0') {
        // Do nothing to prevent multiple leading zeros
      } else if (currentInput === '0' && value !== '.') {
        setCurrentInput(value);
        setHistory(prev => prev.slice(0, -1) + value);
      } else if (currentInput === '-0' && value !== '.') {
        // Replace '-0' with '-value'
        setCurrentInput('-' + value);
        setHistory(prev => prev.slice(0, -1) + value);
      } else {
        // Continue appending numbers
        setCurrentInput(prev => prev + value);
        setHistory(prev => prev + value);
      }
    }
  }

  const handleOperatorClick = (value) => {
    if (currentInput !== '' && currentInput !== '-') {
      if (operator) {
        handleEquals(); // Perform the calculation with the existing operator
      } else {
        setPreviousInput(currentInput);
        setCurrentInput('');
      }
    } else if (currentInput === '-') {
      // Incomplete negative number not followed by a digit
      // Treat the '-' as an operator to be replaced
      setCurrentInput(''); // Clear the incomplete negative sign
    }

    // Replace the operator
    setOperator(value);
    setHistory((prev) => {
      let trimmedHistory = prev.trimEnd();
      // Remove any trailing operators or incomplete negative signs
      while (["+", "-", "*", "/"].includes(trimmedHistory.slice(-1)) || trimmedHistory.slice(-1) === '-') {
        trimmedHistory = trimmedHistory.slice(0, -1).trimEnd();
      }
      // Append the new operator
      return trimmedHistory + ' ' + value + ' ';
    });
    setIsResultDisplayed(false);
  };

  const handleClear = () => {
    setCurrentInput('');
    setPreviousInput('');
    setOperator('');
    setResult(0);
    setHistory('');
  };

  const handleDecimal = () => {
    setCurrentInput(prev => prev + ".")
    setHistory((prev) => { return prev + "." });
  }

  const handleEquals = () => {
    if (previousInput && currentInput && operator) {
      let calculation;
      switch (operator) {
        case '+':
          calculation = parseFloat(previousInput) + parseFloat(currentInput);
          break;
        case '-':
          calculation = parseFloat(previousInput) - parseFloat(currentInput);
          break;
        case '*':
          calculation = parseFloat(previousInput) * parseFloat(currentInput);
          break;
        case '/':
          if (parseFloat(currentInput) === 0) {
            calculation = 'Infinity';
          } else {
            calculation = parseFloat(previousInput) / parseFloat(currentInput);
          }
          break;
        default:
          break;
      }
      calculation = calculation.toString();
      setResult(calculation);
      setCurrentInput('');
      setHistory((prev) => { return prev + '  = ' + calculation });
      setPreviousInput(calculation);
      setOperator('');
      setIsResultDisplayed(true)
    }
  }

  const handleButtonClick = (event) => {
    const value = event.target.innerText;

    if (!isNaN(value)) {
      handleNumberClick(value);
    } else if (["*", "/", "+", "-"].includes(value)) {
      if (value === '-' && currentInput === '' && operator === '' && previousInput === '') {
        // Starting a negative number at the very beginning
        setCurrentInput('-');
        setHistory(prev => prev + '-');
      } else if (value === '-' && currentInput === '' && operator) {
        // Potentially starting a negative number after an operator
        setCurrentInput('-');
        setHistory(prev => prev + '-');
      } else {
        // Operator pressed after operator or incomplete negative number
        handleOperatorClick(value);
      }
    } else if (value === "AC") {
      handleClear();
    } else if (value === "=") {
      handleEquals();
    } else if (value === ".") {
      if (!currentInput.includes(".") && currentInput !== '') {
        handleDecimal();
      }
    }
  }

  return (
    <div id="calculator">
      <div id="history">
        {/* history.map((entry, index) => (
          <p key={index}>{entry}</p>
        ))*/}
        {history}
      </div>
      <div id="display">
        {/* This will be the area where the calculation will be displayed */}
        {result || currentInput || operator || 0}
      </div>
      <div className="buttons">
        {/* Clear button */}
        <button className="calculator-button" id="clear" onClick={handleButtonClick}>AC</button>

        {/* Mathematical Operators */}
        <button className="calculator-button" id="divide" onClick={handleButtonClick}>/</button>
        <button className="calculator-button" id="multiply" onClick={handleButtonClick}>*</button>
        <button className="calculator-button" id="subtract" onClick={handleButtonClick}>-</button>
        <button className="calculator-button" id="add" onClick={handleButtonClick}>+</button>

        {/* Number buttons */}
        <button className="calculator-button" id="seven" onClick={handleButtonClick}>7</button>
        <button className="calculator-button" id="eight" onClick={handleButtonClick}>8</button>
        <button className="calculator-button" id="nine" onClick={handleButtonClick}>9</button>
        <button className="calculator-button" id="four" onClick={handleButtonClick}>4</button>
        <button className="calculator-button" id="five" onClick={handleButtonClick}>5</button>
        <button className="calculator-button" id="six" onClick={handleButtonClick}>6</button>
        <button className="calculator-button" id="one" onClick={handleButtonClick}>1</button>
        <button className="calculator-button" id="two" onClick={handleButtonClick}>2</button>
        <button className="calculator-button" id="three" onClick={handleButtonClick}>3</button>
        <button className="calculator-button" id="zero" onClick={handleButtonClick}>0</button>

        {/* Decimal and Equals buttons */}
        <button id="decimal" onClick={handleButtonClick}>.</button>
        <button id="equals" onClick={handleButtonClick}>=</button>
      </div>
    </div>
  );
}

export default App;
