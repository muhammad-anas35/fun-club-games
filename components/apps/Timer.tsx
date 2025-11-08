'use client'

import { useState, useEffect, useRef } from 'react'

export default function Timer() {
  const [time, setTime] = useState(0) // in seconds
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState<'timer' | 'stopwatch'>('stopwatch') // 'timer' or 'stopwatch'
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle timer/stopwatch logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (mode === 'stopwatch') {
          // For stopwatch, increment time
          setTime(prevTime => prevTime + 1)
        } else {
          // For timer, decrement time
          setTime(prevTime => {
            if (prevTime <= 1) {
              setIsRunning(false)
              // Timer finished, could add alert or notification
              return 0
            }
            return prevTime - 1
          })
        }
      }, 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, mode])

  // Format time for display
  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Handle timer setup
  const handleSetTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds
    if (totalSeconds > 0) {
      setTime(totalSeconds)
      setMode('timer')
    }
  }

  // Reset timer
  const resetTimer = () => {
    setIsRunning(false)
    if (mode === 'timer') {
      setTime(hours * 3600 + minutes * 60 + seconds)
    } else {
      setTime(0)
    }
  }

  // Start/pause toggle
  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    // Start/Pause with Space or Enter
    if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) {
      e.preventDefault();
      toggleTimer();
    }
    
    // Reset with Escape
    if (e.key === 'Escape') {
      resetTimer();
    }
    
    // Switch modes with T key
    if (e.key.toLowerCase() === 't' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      setMode(prev => prev === 'stopwatch' ? 'timer' : 'stopwatch');
      resetTimer(); // Reset when switching
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isRunning, mode]);

  return (
    <div className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-800 to-indigo-900 rounded-2xl shadow-2xl overflow-hidden border border-purple-700">
      <div className="p-6 bg-gradient-to-r from-purple-900 to-indigo-800">
        <h3 className="text-2xl font-bold text-white text-center mb-6">Timer & Stopwatch</h3>
        
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2 bg-purple-700/50 p-1 rounded-lg">
            <button
              onClick={() => setMode('stopwatch')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'stopwatch'
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-200 hover:bg-purple-600/50'
              }`}
            >
              Stopwatch
            </button>
            <button
              onClick={() => setMode('timer')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                mode === 'timer'
                  ? 'bg-purple-600 text-white'
                  : 'text-purple-200 hover:bg-purple-600/50'
              }`}
            >
              Timer
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="text-center mb-8">
          <div className="text-5xl font-mono font-bold text-white bg-black/30 py-4 rounded-xl">
            {formatTime(time)}
          </div>
          <div className="text-purple-300 text-sm mt-2">
            Press Space/Enter to {isRunning ? 'pause' : 'start'}, Esc to reset
          </div>
        </div>

        {/* Timer setup (only visible in timer mode) */}
        {mode === 'timer' && (
          <div className="mb-6 bg-purple-900/30 p-4 rounded-xl">
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div>
                <label className="block text-purple-200 text-xs mb-1">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  value={hours}
                  onChange={(e) => setHours(Math.min(99, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full bg-purple-700 text-white py-2 px-3 rounded-lg border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSetTimer();
                  }}
                />
              </div>
              <div>
                <label className="block text-purple-200 text-xs mb-1">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full bg-purple-700 text-white py-2 px-3 rounded-lg border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSetTimer();
                  }}
                />
              </div>
              <div>
                <label className="block text-purple-200 text-xs mb-1">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                  className="w-full bg-purple-700 text-white py-2 px-3 rounded-lg border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSetTimer();
                  }}
                />
              </div>
            </div>
            <button
              onClick={handleSetTimer}
              className="w-full py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-medium transition-colors"
            >
              Set Timer
            </button>
          </div>
        )}

        {/* Controls */}
        <div className="flex justify-center gap-4">
          <button
            onClick={toggleTimer}
            className={`px-6 py-3 rounded-xl font-bold text-white shadow-lg transition-transform hover:scale-105 ${
              isRunning
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700'
                : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
            }`}
          >
            {isRunning ? 'Pause' : mode === 'timer' && time === 0 ? 'Start' : 'Start'}
          </button>
          <button
            onClick={resetTimer}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl font-bold shadow-lg transition-transform hover:scale-105"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  )
}