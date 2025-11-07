'use client'

import { useEffect } from 'react'

interface GameModalProps {
  title: string
  onClose: () => void
  children: React.ReactNode
}

export default function GameModal({ title, onClose, children }: GameModalProps) {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('game-modal')) {
        onClose()
      }
    }
    
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-sm flex items-center justify-center animate-fade-in game-modal p-4">
      <div className="glass-effect rounded-2xl sm:rounded-3xl p-0 w-full max-w-[95%] sm:max-w-[90%] md:max-w-[900px] max-h-[90vh] overflow-y-auto shadow-2xl border-3 border-primary/30 animate-slide-down relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-accent to-primary bg-[length:200%_100%] animate-modal-bar rounded-t-2xl sm:rounded-t-3xl"></div>
        <div className="bg-gradient-primary bg-[length:200%_200%] animate-header-gradient text-white px-5 sm:px-8 py-4 sm:py-5 rounded-t-2xl sm:rounded-t-3xl flex justify-between items-center shadow-lg relative z-10">
          <h2 className="m-0 text-xl sm:text-2xl md:text-3xl font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="bg-white/20 border-2 border-white/30 text-white text-3xl sm:text-4xl w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer transition-all duration-300 flex items-center justify-center leading-none hover:bg-white/30 hover:rotate-90"
          >
            &times;
          </button>
        </div>
        <div className="p-4 sm:p-8">{children}</div>
      </div>
    </div>
  )
}

