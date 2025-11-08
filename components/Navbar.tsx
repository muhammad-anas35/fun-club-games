'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface NavbarProps {
  isLoggedIn?: boolean;
  onNavigate?: (section: string) => void;
}

export default function Navbar({ isLoggedIn = false, onNavigate }: NavbarProps) {
  const [activeSection, setActiveSection] = useState('Home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    // Update active section based on current route
    if (pathname === '/' || pathname === '/home') {
      setActiveSection('Home')
    } else if (pathname === '/games') {
      setActiveSection('Games')
    } else if (pathname === '/leaderboard') {
      setActiveSection('Leaderboard')
    } else if (pathname === '/profile') {
      setActiveSection('Profile')
    } else if (pathname === '/about') {
      setActiveSection('About')
    } else if (pathname === '/help') {
      setActiveSection('Help')
    } else if (pathname === '/contact') {
      setActiveSection('Contact')
    }
  }, [pathname])

  const handleNavigation = (section: string) => {
    setActiveSection(section)
    if (onNavigate) {
      onNavigate(section)
    } else {
      // Default navigation behavior - only scroll if element exists
      const elementSelectors: Record<string, string[]> = {
        'Home': ['header', 'main', '#top'],
        'Games': ['.quick-actions', '[data-game="snake-ladder"]', '.games-section'],
        'Apps': ['.apps-section', '[data-app="calculator"]', '.apps-section'],
        'Leaderboard': ['.leaderboard', '#leaderboard-section', '.leaderboard-section'],
        'Profile': ['.profile', '#profile-section', '.profile-section'],
        'About': ['.about', '#about-section', '.about-section'],
        'Help': ['.help', '#help-section', '.help-section'],
        'Contact': ['.contact', '#contact-section', '.contact-section']
      }
      
      const selectors = elementSelectors[section] || []
      let elementFound = false
      
      for (const selector of selectors) {
        const element = document.querySelector(selector)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          elementFound = true
          break
        }
      }
      
      // Only show alert if no element was found and we're trying to navigate to a future section
      if (!elementFound && ['Leaderboard', 'Profile', 'About', 'Help', 'Contact'].includes(section)) {
        console.warn(`${section} section not implemented yet`)
      }
    }
    // Close mobile menu after navigation
    setMobileMenuOpen(false)
  }

  const navLinks = isLoggedIn 
    ? [
        { icon: 'fa-home', label: 'Home', section: 'Home' },
        { icon: 'fa-gamepad', label: 'Games', section: 'Games' },
        { icon: 'fa-th', label: 'Apps', section: 'Apps' },
        { icon: 'fa-trophy', label: 'Leaderboard', section: 'Leaderboard' },
        { icon: 'fa-user', label: 'Profile', section: 'Profile' }
      ]
    : [
        { icon: 'fa-home', label: 'Home', section: 'Home' },
        { icon: 'fa-th', label: 'Apps', section: 'Apps' },
        { icon: 'fa-info-circle', label: 'About', section: 'About' },
        { icon: 'fa-question-circle', label: 'Help', section: 'Help' },
        { icon: 'fa-envelope', label: 'Contact', section: 'Contact' }
      ]

  return (
    <>
      <nav className="w-full bg-gradient-to-r from-secondary via-secondary-dark to-primary to-accent bg-[length:300%_300%] animate-gradient-shift px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center fixed top-0 left-0 z-[1000] shadow-lg border-b-4 border-white/30 overflow-hidden">
      <div className="relative w-16 h-16 flex items-center justify-center gap-1">
        <div className="text-2xl animate-float drop-shadow-md">🎮</div>
        <div className="text-2xl animate-float delay-150 drop-shadow-md">🎲</div>
      </div>
      
      <div className="flex items-center gap-3 text-white text-3xl md:text-4xl font-extrabold tracking-wide relative z-10 drop-shadow-lg">
        <span className="text-4xl md:text-5xl animate-spin-bounce drop-shadow-lg">🎯</span>
        <span className="flex items-center gap-1">
          {['F', 'u', 'n', ' ', 'C', 'l', 'u', 'b', '!'].map((letter, idx) => (
            <span
              key={idx}
              className={`inline-block ${letter === ' ' ? 'w-2' : letter === '!' ? 'animate-bounce' : 'animate-bounce-letter'}`}
              style={{ animationDelay: `${idx * 0.1}s` }}
              aria-hidden={letter === ' '}
            >
              {letter}
            </span>
          ))}
        </span>
      </div>
      
      {/* Navigation links - hidden on mobile */}
      <ul className="hidden md:flex gap-3 md:gap-4 lg:gap-6 list-none">
        {navLinks.map((link, idx) => (
          <li key={idx}>
            <button
              className={`text-white text-sm md:text-base lg:text-lg font-semibold no-underline flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-110 ${
                activeSection === link.section ? 'bg-white/20 scale-110' : ''
              }`}
              onClick={() => handleNavigation(link.section)}
              aria-label={`Navigate to ${link.label}`}
            >
              <i className={`fas ${link.icon}`}></i>
              <span>{link.label}</span>
            </button>
          </li>
        ))}
      </ul>
      
      <div className="flex items-center gap-3">
        <div className="relative w-16 h-16 flex items-center justify-center gap-1">
          <div className="text-2xl animate-float delay-300 drop-shadow-md">🎨</div>
          <div className="text-2xl animate-float delay-500 drop-shadow-md">⭐</div>
        </div>
        <div className="flex gap-2">
          <a 
            href="https://github.com/muhammad-anas35/muhammad-anas35" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-accent transition-colors"
            aria-label="Visit developer's GitHub profile"
          >
            <i className="fab fa-github text-xl"></i>
          </a>
          <a 
            href="https://x.com/muhammad_anas35" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-accent transition-colors"
            aria-label="Visit developer's X (Twitter) profile"
          >
            <i className="fab fa-x-twitter text-xl"></i>
          </a>
        </div>

        {/* Mobile menu button - only visible on small screens */}
        <button 
          className="md:hidden text-white text-2xl z-[1001]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileMenuOpen}
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
      </div>
    </nav>
    {/* Mobile Navigation Menu */}
    {mobileMenuOpen && (
        <div className="fixed inset-0 bg-gradient-to-br from-primary to-secondary z-[999] flex flex-col items-center justify-center pt-20 px-4 pb-16">
          <button 
            className="absolute top-5 right-5 text-white text-2xl z-10"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <i className="fas fa-times"></i>
          </button>
          
          <div className="flex flex-col items-center gap-6 mb-10">
            <div className="text-4xl animate-spin-bounce drop-shadow-lg mb-4">🎯</div>
            <div className="flex items-center gap-1 mb-8">
              {['F', 'u', 'n', ' ', 'C', 'l', 'u', 'b', '!'].map((letter, idx) => (
                <span
                  key={idx}
                  className={`text-3xl font-bold ${letter === ' ' ? 'w-4' : letter === '!' ? 'animate-bounce' : 'animate-bounce-letter'}`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  aria-hidden={letter === ' '}
                >
                  {letter}
                </span>
              ))}
            </div>
          </div>

          <ul className="flex flex-col items-center gap-6 mb-10 w-full max-w-xs">
            {navLinks.map((link, idx) => (
              <li key={idx} className="w-full">
                <button
                  className={`w-full text-white text-xl font-semibold no-underline flex items-center justify-center gap-3 px-6 py-4 rounded-full transition-all duration-300 hover:bg-white/20 ${
                    activeSection === link.section ? 'bg-white/20' : ''
                  }`}
                  onClick={() => {
                    handleNavigation(link.section)
                    setMobileMenuOpen(false)
                  }}
                  aria-label={`Navigate to ${link.label}`}
                >
                  <i className={`fas ${link.icon} text-2xl`}></i>
                  <span>{link.label}</span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex gap-8 mb-8">
            <a
              href="https://github.com/muhammad-anas35/muhammad-anas35"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-accent transition-colors"
              aria-label="Visit developer's GitHub profile"
            >
              <i className="fab fa-github text-3xl"></i>
            </a>
            <a
              href="https://x.com/muhammad_anas35"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-accent transition-colors"
              aria-label="Visit developer's X (Twitter) profile"
            >
              <i className="fab fa-x-twitter text-3xl"></i>
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-2xl animate-float delay-300 drop-shadow-md">🎨</div>
            <div className="text-2xl animate-float delay-500 drop-shadow-md">⭐</div>
          </div>
        </div>
      )}
    </>
  )
}

