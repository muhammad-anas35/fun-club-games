'use client'

import { useState, useEffect } from 'react'

// Define currency types
type CurrencyCode = 
  | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'CHF' | 'CNY' 
  | 'INR' | 'MXN' | 'SGD' | 'NZD' | 'ZAR' | 'SEK' | 'NOK' | 'RUB'
  | 'KRW' | 'TRY' | 'BRL' | 'AED'

const currencies: { code: CurrencyCode; name: string; symbol: string }[] = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'MXN', name: 'Mexican Peso', symbol: '$' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R' },
  { code: 'SEK', name: 'Swedish Krona', symbol: 'kr' },
  { code: 'NOK', name: 'Norwegian Krone', symbol: 'kr' },
  { code: 'RUB', name: 'Russian Ruble', symbol: '₽' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' }
]

// Mock exchange rates (would normally come from an API)
const mockExchangeRates: Record<string, number> = {
  'USD': 1,
  'EUR': 0.85,
  'GBP': 0.72,
  'JPY': 110,
  'CAD': 1.25,
  'AUD': 1.35,
  'CHF': 0.92,
  'CNY': 6.45,
  'INR': 74.5,
  'MXN': 20.1,
  'SGD': 1.34,
  'NZD': 1.42,
  'ZAR': 14.8,
  'SEK': 8.6,
  'NOK': 8.9,
  'RUB': 73.5,
  'KRW': 1180,
  'TRY': 8.6,
  'BRL': 5.2,
  'AED': 3.67
}

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<string>('1')
  const [fromCurrency, setFromCurrency] = useState<CurrencyCode>('USD')
  const [toCurrency, setToCurrency] = useState<CurrencyCode>('EUR')
  const [convertedAmount, setConvertedAmount] = useState<string>('')
  const [isSwapping, setIsSwapping] = useState<boolean>(false)
  const [lastUpdated, setLastUpdated] = useState<string>('')

  // Initialize with converted amount
  useEffect(() => {
    convertCurrency()
    setLastUpdated(new Date().toLocaleTimeString())
  }, [])

  const convertCurrency = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) {
      setConvertedAmount('')
      return
    }

    // Get exchange rates relative to USD
    const fromRate = mockExchangeRates[fromCurrency]
    const toRate = mockExchangeRates[toCurrency]

    if (!fromRate || !toRate) {
      setConvertedAmount('Error')
      return
    }

    // Convert: amount * (toRate / fromRate)
    const result = numAmount * (toRate / fromRate)
    setConvertedAmount(result.toFixed(2))
  }

  useEffect(() => {
    convertCurrency()
  }, [amount, fromCurrency, toCurrency])

  const handleSwap = () => {
    setIsSwapping(true)
    const temp = fromCurrency
    setFromCurrency(toCurrency)
    setToCurrency(temp)
    
    // Brief animation effect
    setTimeout(() => setIsSwapping(false), 300)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value)
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    // Swap currencies on 's' key
    if (e.key.toLowerCase() === 's' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault(); // Prevent browser shortcut
      handleSwap();
    }
    
    // Convert on Enter key 
    if (e.key === 'Enter') {
      convertCurrency();
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [amount, fromCurrency, toCurrency]);

  const formatCurrency = (value: string, currencyCode: CurrencyCode) => {
    const currency = currencies.find(c => c.code === currencyCode)
    if (!currency) return value
    
    return `${currency.symbol} ${value}`
  }

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-blue-800 to-indigo-900 rounded-2xl shadow-2xl overflow-hidden border border-blue-700">
      <div className="p-6 bg-gradient-to-r from-blue-900 to-indigo-800">
        <h3 className="text-2xl font-bold text-white text-center mb-6">Currency Converter</h3>
        
        <div className="space-y-6">
          {/* From Currency */}
          <div>
            <label className="block text-blue-200 text-sm font-medium mb-2">
              From
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={amount}
                onChange={handleAmountChange}
                className="flex-1 bg-blue-700 text-white py-3 px-4 rounded-xl border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Amount"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') convertCurrency();
                }}
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as CurrencyCode)}
                className="w-1/3 bg-blue-700 text-white py-3 px-3 rounded-xl border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              disabled={isSwapping}
              className={`p-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full text-white shadow-lg transform transition-all duration-300 ${
                isSwapping ? 'rotate-180' : ''
              } hover:from-amber-600 hover:to-amber-700 hover:scale-110`}
              title="Press Ctrl+S to swap currencies"
            >
              <i className="fas fa-exchange-alt"></i>
            </button>
          </div>

          {/* To Currency */}
          <div>
            <label className="block text-blue-200 text-sm font-medium mb-2">
              To
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={convertedAmount}
                readOnly
                className="flex-1 bg-blue-700 text-white py-3 px-4 rounded-xl border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as CurrencyCode)}
                className="w-1/3 bg-blue-700 text-white py-3 px-3 rounded-xl border border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result Display */}
          <div className="bg-blue-900/50 p-4 rounded-xl border border-blue-700">
            <div className="text-center text-blue-200 text-sm">
              {amount} {fromCurrency} = {convertedAmount} {toCurrency}
            </div>
            <div className="text-center text-blue-300 text-xs mt-2">
              Last updated: {lastUpdated}
            </div>
          </div>

          {/* Conversion Examples */}
          <div className="bg-blue-900/30 p-4 rounded-xl border border-blue-700">
            <h4 className="text-blue-200 font-medium mb-2">Quick Examples</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-blue-200">1 USD = {mockExchangeRates['EUR'].toFixed(4)} EUR</div>
              <div className="text-blue-200">1 EUR = {Number((1 / mockExchangeRates['EUR']).toFixed(4))} USD</div>
              <div className="text-blue-200">1 GBP = {mockExchangeRates['USD'].toFixed(4)} USD</div>
              <div className="text-blue-200">1 JPY = {mockExchangeRates['USD'].toFixed(4)} USD</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}