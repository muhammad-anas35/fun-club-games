'use client'

import { useState } from 'react'
import { useUserStats } from '@/hooks/useUserStats'
import { useActivityFeed } from '@/hooks/useActivityFeed'
import SnakeLadderModal from './games/SnakeLadderModal'
import PuzzleModal from './games/PuzzleModal'
import TicTacToeModal from './games/TicTacToeModal'
import MemoryModal from './games/MemoryModal'
import RPSModal from './games/RPSModal'
import QuizModal from './games/QuizModal'
import HistoryModal from './games/HistoryModal'
import Calculator from './apps/Calculator'
import CurrencyConverter from './apps/CurrencyConverter'
import Timer from './apps/Timer'

interface LandingPageProps {
  username: string
  onLogout: () => void
}

export default function LandingPage({ username, onLogout }: LandingPageProps) {
  const { stats, incrementGameCount } = useUserStats()
  const { activities, saveActivity } = useActivityFeed()
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [activeApp, setActiveApp] = useState<string | null>(null)
  const [showAllActivities, setShowAllActivities] = useState(false)

  const handleAction = (action: string) => {
    switch(action) {
      case 'play-game':
        incrementGameCount()
        saveActivity('🎲 Started playing Snake & Ladder!', 'fa-dice')
        setActiveModal('snake-ladder')
        break
      case 'puzzle-games':
        saveActivity('🧩 Started playing Puzzle Game!', 'fa-puzzle-piece')
        setActiveModal('puzzle')
        break
      case 'tictactoe':
        incrementGameCount()
        saveActivity('❌ Started playing Tic-Tac-Toe!', 'fa-times')
        setActiveModal('tictactoe')
        break
      case 'memory-game':
        incrementGameCount()
        saveActivity('🧠 Started playing Memory Match!', 'fa-brain')
        setActiveModal('memory')
        break
      case 'rock-paper-scissors':
        incrementGameCount()
        saveActivity('✂️ Started playing Rock Paper Scissors!', 'fa-hand-rock')
        setActiveModal('rps')
        break
      case 'quiz-game':
        incrementGameCount()
        saveActivity('❓ Started playing Trivia Quiz!', 'fa-question-circle')
        setActiveModal('quiz')
        break
      case 'game-history':
        setActiveModal('history')
        break
      case 'calculator':
        setActiveApp('calculator')
        saveActivity('🔢 Opened Calculator App!', 'fa-calculator')
        break
      case 'currency-converter':
        setActiveApp('currency-converter')
        saveActivity('💱 Opened Currency Converter!', 'fa-exchange-alt')
        break
      case 'timer':
        setActiveApp('timer')
        saveActivity('⏱️ Opened Timer App!', 'fa-clock')
        break
      default:
        break
    }
  }

  return (
    <>
      <div className="w-full min-h-[calc(100vh-80px)] px-4 sm:px-5 py-8 sm:py-10 mt-20 max-w-7xl mx-auto">
        <div className="text-center py-10 sm:py-16 px-4 sm:px-5 bg-gradient-hero bg-[length:200%_200%] animate-hero-gradient rounded-2xl sm:rounded-3xl mb-8 sm:mb-12 shadow-2xl border-2 border-primary/20 backdrop-blur-lg relative overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-[200%] h-[200%] bg-gradient-radial from-primary/10 to-transparent animate-hero-pulse"></div>
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 gradient-text tracking-wide">
              Welcome back, <span className="bg-gradient-to-r from-primary-dark to-secondary bg-clip-text text-transparent">{username}</span>!
            </h1>
            <p className="text-base sm:text-xl text-gray-600 font-normal">Ready to continue your gaming adventure?</p>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 sm:gap-6 mb-5">
            {[
              { icon: 'fa-trophy', label: 'Games Played', value: stats.games },
              { icon: 'fa-star', label: 'Achievements', value: stats.achievements },
              { icon: 'fa-fire', label: 'Day Streak', value: stats.streak }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="glass-effect rounded-xl sm:rounded-2xl p-5 sm:p-8 flex items-center gap-3 sm:gap-5 shadow-lg border-2 border-primary/20 transition-all duration-300 hover:-translate-y-2 hover:scale-105 hover:shadow-xl hover:border-primary relative overflow-hidden group"
              >
                <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-radial from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="w-12 h-12 sm:w-[70px] sm:h-[70px] bg-gradient-primary bg-[length:200%_200%] animate-icon-gradient rounded-lg sm:rounded-xl flex items-center justify-center text-xl sm:text-3xl text-white shadow-lg relative z-10 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl sm:text-4xl text-primary m-0 mb-1 font-bold">{stat.value}</h3>
                  <p className="text-sm sm:text-base text-gray-600 m-0">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 quick-actions">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-primary mb-6 sm:mb-8 font-bold text-center">Quick Actions</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3 sm:gap-5">
              {[
                { icon: 'fa-dice', title: 'Snake & Ladder', desc: 'Classic board game fun!', action: 'play-game' },
                { icon: 'fa-puzzle-piece', title: 'Number Puzzle', desc: 'Challenge your mind!', action: 'puzzle-games' },
                { icon: 'fa-times', title: 'Tic-Tac-Toe', desc: 'Classic X and O game!', action: 'tictactoe' },
                { icon: 'fa-brain', title: 'Memory Match', desc: 'Test your memory!', action: 'memory-game' },
                { icon: 'fa-hand-rock', title: 'Rock Paper Scissors', desc: 'Quick fun game!', action: 'rock-paper-scissors' },
                { icon: 'fa-question-circle', title: 'Trivia Quiz', desc: 'Test your knowledge!', action: 'quiz-game' },
                { icon: 'fa-cog', title: 'Game History', desc: 'View your game stats', action: 'game-history' }
              ].map((game, idx) => (
                <div
                  key={idx}
                  className="glass-effect rounded-2xl sm:rounded-3xl p-5 sm:p-9 text-center shadow-lg border-2 border-primary/20 transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl hover:border-primary relative overflow-hidden group"
                >
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-left duration-500 group-hover:left-full"></div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary bg-[length:200%_200%] animate-icon-gradient rounded-xl sm:rounded-[22px] flex items-center justify-center text-3xl sm:text-4xl text-white mb-3 sm:mb-5 shadow-lg relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-transform">
                    <i className={`fas ${game.icon}`}></i>
                  </div>
                  <h3 className="text-xl sm:text-2xl text-primary m-0 mb-2 font-bold">{game.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 m-0 mb-3 sm:mb-5 flex-1">{game.desc}</p>
                  <button
                    onClick={() => handleAction(game.action)}
                    className="w-full max-w-[200px] py-2.5 sm:py-3.5 px-6 sm:px-9 bg-gradient-button bg-[length:200%_200%] animate-button-gradient text-white border-none rounded-[25px] sm:rounded-[30px] text-sm sm:text-base font-bold cursor-pointer transition-all duration-300 shadow-lg relative overflow-hidden uppercase tracking-wide hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
                  >
                    <span className="relative z-10">Play Now</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 apps-section">
            <h2 className="text-2xl sm:text-3xl md:text-4xl text-primary mb-6 sm:mb-8 font-bold text-center">Apps</h2>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] sm:grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-3 sm:gap-5">
              {[
                { icon: 'fa-calculator', title: 'Calculator', desc: 'Simple and powerful calculator', action: 'calculator' },
                { icon: 'fa-exchange-alt', title: 'Currency Converter', desc: 'Convert between currencies', action: 'currency-converter' },
                { icon: 'fa-clock', title: 'Timer', desc: 'Stopwatch and timer tools', action: 'timer' }
              ].map((app, idx) => (
                <div
                  key={idx}
                  className="glass-effect rounded-2xl sm:rounded-3xl p-5 sm:p-9 text-center shadow-lg border-2 border-primary/20 transition-all duration-300 hover:-translate-y-3 hover:scale-105 hover:shadow-2xl hover:border-primary relative overflow-hidden group"
                >
                  <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-left duration-500 group-hover:left-full"></div>
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary bg-[length:200%_200%] animate-icon-gradient rounded-xl sm:rounded-[22px] flex items-center justify-center text-3xl sm:text-4xl text-white mb-3 sm:mb-5 shadow-lg relative z-10 group-hover:scale-125 group-hover:rotate-12 transition-transform">
                    <i className={`fas ${app.icon}`}></i>
                  </div>
                  <h3 className="text-xl sm:text-2xl text-primary m-0 mb-2 font-bold">{app.title}</h3>
                  <p className="text-sm sm:text-base text-gray-600 m-0 mb-3 sm:mb-5 flex-1">{app.desc}</p>
                  <button
                    onClick={() => handleAction(app.action)}
                    className="w-full max-w-[200px] py-2.5 sm:py-3.5 px-6 sm:px-9 bg-gradient-button bg-[length:200%_200%] animate-button-gradient text-white border-none rounded-[25px] sm:rounded-[30px] text-sm sm:text-base font-bold cursor-pointer transition-all duration-300 shadow-lg relative overflow-hidden uppercase tracking-wide hover:-translate-y-1 hover:scale-105 hover:shadow-xl"
                  >
                    <span className="relative z-10">Open</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-effect rounded-2xl sm:rounded-3xl p-5 sm:p-9 shadow-lg border-2 border-primary/20 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-secondary to-accent to-primary bg-[length:200%_100%] animate-activity-bar"></div>
            <div className="flex justify-between items-center mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl text-primary font-bold">Recent Activity</h2>
              {activities.length > 3 && (
                <button
                  onClick={() => setShowAllActivities(!showAllActivities)}
                  className="px-3 py-1 bg-gradient-to-r from-primary to-primary-dark text-white text-xs sm:text-sm rounded-full hover:from-primary-dark hover:to-primary transition-all duration-300 shadow"
                >
                  {showAllActivities ? 'Show Less' : 'More'}
                </button>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:gap-4">
              {activities
                .slice(0, showAllActivities ? undefined : 3)
                .map((activity, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 sm:gap-4 p-4 sm:p-5 bg-gradient-to-r from-primary/5 to-secondary/3 rounded-xl sm:rounded-2xl border-l-4 border-primary transition-all duration-300 hover:translate-x-2 hover:scale-105 hover:shadow-lg hover:border-l-6 relative overflow-hidden group"
                  >
                    <div className="absolute left-0 top-0 h-full w-0 bg-gradient-to-r from-primary/10 to-transparent transition-all duration-300 group-hover:w-full"></div>
                    <i className={`fas ${activity.icon} text-primary text-lg sm:text-xl mt-0.5 relative z-10`}></i>
                    <div className="flex-1 relative z-10">
                      <p className="m-0 mb-1 text-gray-800 text-sm sm:text-base font-bold">{activity.message}</p>
                      <span className="text-gray-500 text-xs sm:text-sm">{activity.time}</span>
                    </div>
                  </div>
                ))}
              {!showAllActivities && activities.length > 3 && (
                <div className="text-center text-gray-600 text-sm py-2">
                  +{activities.length - 3} more activity{activities.length - 3 > 1 ? 'ies' : 'y'}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 text-center">
          <button
            onClick={onLogout}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-primary to-primary-dark text-white border-none rounded-full text-base sm:text-lg font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:-translate-y-1 hover:shadow-xl"
          >
            <i className="fas fa-sign-out-alt mr-2 text-sm sm:text-base"></i> Logout
          </button>
        </div>
      </div>

      {/* Game Modals */}
      {activeModal === 'snake-ladder' && <SnakeLadderModal onClose={() => setActiveModal(null)} saveActivity={saveActivity} incrementGameCount={incrementGameCount} />}
      {activeModal === 'puzzle' && <PuzzleModal onClose={() => setActiveModal(null)} saveActivity={saveActivity} />}
      {activeModal === 'tictactoe' && <TicTacToeModal onClose={() => setActiveModal(null)} saveActivity={saveActivity} incrementGameCount={incrementGameCount} />}
      {activeModal === 'memory' && <MemoryModal onClose={() => setActiveModal(null)} saveActivity={saveActivity} incrementGameCount={incrementGameCount} />}
      {activeModal === 'rps' && <RPSModal onClose={() => setActiveModal(null)} saveActivity={saveActivity} incrementGameCount={incrementGameCount} />}
      {activeModal === 'quiz' && <QuizModal onClose={() => setActiveModal(null)} saveActivity={saveActivity} incrementGameCount={incrementGameCount} />}
      {activeModal === 'history' && <HistoryModal onClose={() => setActiveModal(null)} />}

      {/* App Modals */}
      {activeApp === 'calculator' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Calculator</h3>
              <button 
                onClick={() => setActiveApp(null)} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <Calculator />
            </div>
          </div>
        </div>
      )}

      {activeApp === 'currency-converter' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Currency Converter</h3>
              <button 
                onClick={() => setActiveApp(null)} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <CurrencyConverter />
            </div>
          </div>
        </div>
      )}

      {activeApp === 'timer' && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="p-4 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Timer</h3>
              <button 
                onClick={() => setActiveApp(null)} 
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <Timer />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

