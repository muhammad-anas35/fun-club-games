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
      // Default navigation behavior
      switch(section) {
        case 'Home':
          window.scrollTo({ top: 0, behavior: 'smooth' })
          break
        case 'Games':
          const gamesSection = document.querySelector('.quick-actions') || document.querySelector('[data-game="snake-ladder"]')
          if (gamesSection) {
            gamesSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            console.warn('Games section not found')
          }
          break
        case 'Leaderboard':
          // Navigate to leaderboard section when available
          const leaderboardSection = document.querySelector('.leaderboard') || document.querySelector('#leaderboard-section')
          if (leaderboardSection) {
            leaderboardSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            alert('Leaderboard section will be implemented soon!')
          }
          break
        case 'Profile':
          // Navigate to profile section when available
          const profileSection = document.querySelector('.profile') || document.querySelector('#profile-section')
          if (profileSection) {
            profileSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            alert('Profile section will be implemented soon!')
          }
          break
        case 'About':
          // Navigate to about section when available
          const aboutSection = document.querySelector('.about') || document.querySelector('#about-section')
          if (aboutSection) {
            aboutSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            alert('About section will be implemented soon!')
          }
          break
        case 'Help':
          // Navigate to help section when available
          const helpSection = document.querySelector('.help') || document.querySelector('#help-section')
          if (helpSection) {
            helpSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            alert('Help section will be implemented soon!')
          }
          break
        case 'Contact':
          // Navigate to contact section when available
          const contactSection = document.querySelector('.contact') || document.querySelector('#contact-section')
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
          } else {
            alert('Contact section will be implemented soon!')
          }
          break
      }
    }
  }

  const navLinks = isLoggedIn 
    ? [
        { icon: 'fa-home', label: 'Home', section: 'Home' },
        { icon: 'fa-gamepad', label: 'Games', section: 'Games' },
        { icon: 'fa-trophy', label: 'Leaderboard', section: 'Leaderboard' },
        { icon: 'fa-user', label: 'Profile', section: 'Profile' }
      ]
    : [
        { icon: 'fa-home', label: 'Home', section: 'Home' },
        { icon: 'fa-info-circle', label: 'About', section: 'About' },
        { icon: 'fa-question-circle', label: 'Help', section: 'Help' },
        { icon: 'fa-envelope', label: 'Contact', section: 'Contact' }
      ]

  return (
    <nav className="w-full bg-gradient-to-r from-secondary via-secondary-dark to-primary to-accent bg-[length:300%_300%] animate-gradient-shift px-8 py-4 flex justify-between items-center fixed top-0 left-0 z-[1000] shadow-lg border-b-4 border-white/30 overflow-hidden">
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
            >
              {letter}
            </span>
          ))}
        </span>
      </div>
      
      <ul className="flex gap-4 md:gap-6 list-none">
        {navLinks.map((link, idx) => (
          <li key={idx}>
            <button
              className={`text-white text-base md:text-lg font-semibold no-underline flex items-center gap-2 px-3 py-2 rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-110 ${
                activeSection === link.section ? 'bg-white/20 scale-110' : ''
              }`}
              onClick={() => handleNavigation(link.section)}
              aria-label={link.label}
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
            aria-label="GitHub"
          >
            <i className="fab fa-github text-xl"></i>
          </a>
          <a 
            href="https://x.com/muhammad_anas35" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-accent transition-colors"
            aria-label="Twitter"
          >
            <i className="fab fa-x-twitter text-xl"></i>
          </a>
        </div>
      </div>
    </nav>
  )
}

