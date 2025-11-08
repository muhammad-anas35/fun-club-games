'use client'

import { useState, useEffect, useCallback } from 'react'

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [memory, setMemory] = useState(0)
  const [history, setHistory] = useState<string[]>([])

  const clearAll = useCallback(() => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
    setHistory([])
  }, [])

  const clearEntry = useCallback(() => {
    setDisplay('0')
  }, [])

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(String(digit))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(digit) : display + digit)
    }
  }, [display, waitingForOperand])

  const inputDot = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (!display.includes('.')) {
      setDisplay(display + '.')
    }
  }, [display, waitingForOperand])

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)

      // Add to history
      const historyEntry = `${currentValue} ${operation} ${inputValue} = ${newValue}`
      setHistory(prev => [historyEntry, ...prev.slice(0, 4)]) // Keep last 5 entries

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }, [display, operation, previousValue])

  const calculate = (first: number, second: number, operation: string): number => {
    switch (operation) {
      case '+':
        return first + second
      case '-':
        return first - second
      case '×':
        return first * second
      case '÷':
        return second !== 0 ? first / second : NaN
      case '^':
        return Math.pow(first, second)
      default:
        return second
    }
  }

  const performEquals = useCallback(() => {
    if (operation === null || previousValue === null) return

    const inputValue = parseFloat(display)
    const newValue = calculate(previousValue, inputValue, operation)

    // Add to history
    const historyEntry = `${previousValue} ${operation} ${inputValue} = ${newValue}`
    setHistory(prev => [historyEntry, ...prev.slice(0, 4)]) // Keep last 5 entries

    setDisplay(String(newValue))
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(true)
  }, [display, operation, previousValue])

  const handlePercentage = useCallback(() => {
    const value = parseFloat(display)
    const newValue = value / 100
    setDisplay(String(newValue))
  }, [display])

  const toggleSign = useCallback(() => {
    const value = parseFloat(display)
    const newValue = value * -1
    setDisplay(String(newValue))
  }, [display])

  const memoryAdd = useCallback(() => {
    setMemory(prev => prev + parseFloat(display))
  }, [display])

  const memorySubtract = useCallback(() => {
    setMemory(prev => prev - parseFloat(display))
  }, [display])

  const memoryRecall = useCallback(() => {
    setDisplay(String(memory))
    setWaitingForOperand(false)
  }, [memory])

  const memoryClear = useCallback(() => {
    setMemory(0)
  }, [])

  const squareRoot = useCallback(() => {
    const value = parseFloat(display)
    if (value >= 0) {
      const result = Math.sqrt(value)
      setDisplay(String(result))
    } else {
      setDisplay('Error')
    }
  }, [display])

  const square = useCallback(() => {
    const value = parseFloat(display)
    const result = value * value
    setDisplay(String(result))
  }, [display])

  const reciprocal = useCallback(() => {
    const value = parseFloat(display)
    if (value !== 0) {
      const result = 1 / value
      setDisplay(String(result))
    } else {
      setDisplay('Error')
    }
  }, [display])

  // Handle keyboard events
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default for keys we handle
    if (['+', '-', '*', '/', '=', 'Enter', 'Escape', 'Backspace'].includes(e.key)) {
      e.preventDefault()
    }
    
    if (e.key >= '0' && e.key <= '9') {
      inputDigit(e.key);
    } else if (e.key === '.') {
      inputDot();
    } else if (e.key === '+' || e.key === 'Add') {
      performOperation('+');
    } else if (e.key === '-' || e.key === 'Subtract') {
      performOperation('-');
    } else if (e.key === '*' || e.key === 'Multiply') {
      performOperation('×');
    } else if (e.key === '/') {
      performOperation('÷');
    } else if (e.key === 'Enter' || e.key === '=' || e.key === 'Decimal') {
      performEquals();
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c' || e.key === 'Clear') {
      clearAll();
    } else if (e.key === 'Backspace') {
      // Handle backspace by removing last character
      if (display.length > 1) {
        setDisplay(display.slice(0, -1));
      } else {
        setDisplay('0');
        setWaitingForOperand(false);
      }
    } else if (e.key === '%') {
      handlePercentage();
    } else if (e.key === 'r' || e.key === 'R') {
      // For square root (if we want to use 'r' key)
      squareRoot();
    } else if (e.key === 's' || e.key === 'S') {
      // For square (if we want to use 's' key)
      square();
    } else if (e.key === 't' || e.key === 'T') {
      // For 1/x (if we want to use 't' key for reciprocal)
      reciprocal();
    } else if (e.key.toLowerCase() === 'm') {
      // Simple memory operations using m+ or m-
      if (e.key === 'M') { // Shift + M
        memoryAdd();
      } else if (e.key === 'm') { // m
        memoryRecall();
      }
    }
  }, [inputDigit, inputDot, performOperation, performEquals, clearAll, handlePercentage, squareRoot, square, reciprocal, memoryAdd, memoryRecall, display]);

  // Set up keyboard event listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle keyboard shortcut for memory operations
  useEffect(() => {
    const handleKeyCombo = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch(e.key.toLowerCase()) {
          case 'm':
            e.preventDefault();
            if (e.shiftKey) {
              memoryAdd(); // Ctrl+Shift+M or Cmd+Shift+M
            } else {
              memoryClear(); // Ctrl+M or Cmd+M
            }
            break;
          case 'r':
            e.preventDefault();
            memoryRecall(); // Ctrl+R or Cmd+R
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyCombo);
    return () => {
      window.removeEventListener('keydown', handleKeyCombo);
    };
  }, [memoryAdd, memoryClear, memoryRecall]);

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
      <div className="p-5 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="text-right text-white mb-2">
          <div className="text-gray-400 text-sm h-6">
            {previousValue} {operation}
          </div>
        </div>
        <div className="text-right text-white">
          <div className="text-4xl font-bold mt-2 overflow-x-auto whitespace-nowrap">
            {display}
          </div>
        </div>
      </div>

      <div className="p-5 grid grid-cols-5 gap-2 bg-gray-800">
        {/* Memory Functions */}
        <button
          onClick={memoryClear}
          className="col-span-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
        >
          MC
        </button>
        <button
          onClick={memoryRecall}
          className="col-span-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
        >
          MR
        </button>
        <button
          onClick={memoryAdd}
          className="col-span-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
        >
          M+
        </button>
        <button
          onClick={memorySubtract}
          className="col-span-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
        >
          M-
        </button>
        <button
          onClick={clearAll}
          className="col-span-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
        >
          AC
        </button>

        {/* Advanced Functions */}
        <button
          onClick={squareRoot}
          className="col-span-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          √
        </button>
        <button
          onClick={square}
          className="col-span-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          x²
        </button>
        <button
          onClick={reciprocal}
          className="col-span-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          1/x
        </button>
        <button
          onClick={handlePercentage}
          className="col-span-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          %
        </button>
        <button
          onClick={toggleSign}
          className="col-span-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-lg font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          +/-
        </button>

        {/* Numbers and Operations */}
        <button
          onClick={() => inputDigit('7')}
          className="col-span-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          7
        </button>
        <button
          onClick={() => inputDigit('8')}
          className="col-span-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          8
        </button>
        <button
          onClick={() => inputDigit('9')}
          className="col-span-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          9
        </button>
        <button
          onClick={() => performOperation('÷')}
          className="col-span-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          ÷
        </button>
        <button
          onClick={clearEntry}
          className="col-span-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          CE
        </button>

        <button
          onClick={() => inputDigit('4')}
          className="col-span-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          4
        </button>
        <button
          onClick={() => inputDigit('5')}
          className="col-span-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          5
        </button>
        <button
          onClick={() => inputDigit('6')}
          className="col-span-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          6
        </button>
        <button
          onClick={() => performOperation('×')}
          className="col-span-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          ×
        </button>
        <button
          onClick={() => performOperation('^')}
          className="col-span-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
        >
          x^y
        </button>

        <button
          onClick={() => inputDigit('1')}
          className="col-span-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          1
        </button>
        <button
          onClick={() => inputDigit('2')}
          className="col-span-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          2
        </button>
        <button
          onClick={() => inputDigit('3')}
          className="col-span-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          3
        </button>
        <button
          onClick={() => performOperation('-')}
          className="col-span-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          -
        </button>
        {/* Empty button for layout */}
        <div className="col-span-1"></div>

        <button
          onClick={() => inputDigit('0')}
          className="col-span-2 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          0
        </button>
        <button
          onClick={inputDot}
          className="col-span-1 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          .
        </button>
        <button
          onClick={() => performOperation('+')}
          className="col-span-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          +
        </button>
        <button
          onClick={performEquals}
          className="col-span-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-xl font-bold py-3 px-3 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
        >
          =
        </button>
      </div>

      {/* History panel */}
      {history.length > 0 && (
        <div className="p-4 bg-gray-700/50 border-t border-gray-600">
          <h4 className="text-gray-300 text-sm mb-2">Recent Calculations</h4>
          <div className="max-h-24 overflow-y-auto">
            {history.map((entry, index) => (
              <div key={index} className="text-gray-400 text-xs py-1 border-b border-gray-600 last:border-0">
                {entry}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}