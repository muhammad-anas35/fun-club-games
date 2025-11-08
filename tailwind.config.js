/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'sm': '480px',
      'md': '768px', 
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#DE9843',
          dark: '#C8842E',
          darker: '#B8741F',
        },
        secondary: {
          DEFAULT: '#FF6B9D',
          dark: '#c44569',
        },
        accent: '#FFD93D',
        background: '#fdf2e9',
        'background-light': '#fff9f2',
      },
      fontFamily: {
        sans: ['Bubblegum Sans', 'cursive'],
      },
      animation: {
        'gradient-shift': 'gradientShift 8s ease infinite',
        'shimmer': 'shimmer 3s infinite',
        'float': 'float 3s ease-in-out infinite',
        'bounce-letter': 'bounceLetter 0.6s ease',
        'spin-bounce': 'spinBounce 2s ease-in-out infinite',
        'container-float': 'containerFloat 6s ease-in-out infinite',
        'border-glow': 'borderGlow 3s ease infinite',
        'hero-gradient': 'heroGradient 8s ease infinite',
        'hero-pulse': 'heroPulse 4s ease-in-out infinite',
        'title-gradient': 'titleGradient 5s ease infinite',
        'icon-gradient': 'iconGradient 3s ease infinite',
        'button-gradient': 'buttonGradient 4s ease infinite',
        'activity-bar': 'activityBar 3s linear infinite',
        'modal-bar': 'modalBar 3s linear infinite',
        'header-gradient': 'headerGradient 4s ease infinite',
        'fade-in': 'fadeIn 0.3s ease',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        'player-bounce': 'playerBounce 0.5s ease',
        'cell-pulse': 'cellPulse 0.3s ease',
        'confetti-fall': 'confettiFall 3s linear forwards',
        'winning-pulse': 'winningPulse 1s ease infinite',
        'cell-appear': 'cellAppear 0.3s ease',
        'match-success': 'matchSuccess 0.5s ease',
        'pulse': 'pulse 0.5s ease',
        'choice-reveal': 'choiceReveal 0.5s ease',
        'bounce': 'bounce 0.6s ease',
        'correct-pulse': 'correctPulse 0.5s ease',
        'shake': 'shake 0.5s ease',
      },
      keyframes: {
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { left: '-100%' },
          '100%': { left: '100%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(10deg)' },
        },
        bounceLetter: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-15px)' },
        },
        spinBounce: {
          '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
        },
        containerFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        borderGlow: {
          '0%, 100%': { opacity: '0.3', filter: 'blur(5px)' },
          '50%': { opacity: '0.5', filter: 'blur(8px)' },
        },
        heroGradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        heroPulse: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.5' },
          '50%': { transform: 'scale(1.2)', opacity: '0.8' },
        },
        titleGradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        iconGradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        buttonGradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        activityBar: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
        modalBar: {
          '0%': { backgroundPosition: '0% 0%' },
          '100%': { backgroundPosition: '200% 0%' },
        },
        headerGradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideDown: {
          from: {
            transform: 'translateY(-50px)',
            opacity: '0',
          },
          to: {
            transform: 'translateY(0)',
            opacity: '1',
          },
        },
        playerBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        cellPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        confettiFall: {
          '0%': {
            transform: 'translateY(0) rotate(0deg)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(100vh) rotate(720deg)',
            opacity: '0',
          },
        },
        winningPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        cellAppear: {
          '0%': {
            transform: 'scale(0) rotate(180deg)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: '1',
          },
        },
        matchSuccess: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1) rotate(5deg)' },
        },
        pulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        choiceReveal: {
          '0%': {
            transform: 'scale(0) rotate(180deg)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)',
            opacity: '1',
          },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%': { transform: 'translateY(-20px)' },
          '75%': { transform: 'translateY(-10px)' },
        },
        correctPulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)', boxShadow: '0 0 20px rgba(81, 207, 102, 0.6)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #DE9843 0%, #C8842E 50%, #FF6B9D 100%)',
        'gradient-hero': 'linear-gradient(135deg, rgba(222, 152, 67, 0.15) 0%, rgba(255, 107, 157, 0.1) 50%, rgba(255, 217, 61, 0.1) 100%)',
        'gradient-title': 'linear-gradient(135deg, #DE9843 0%, #C8842E 30%, #FF6B9D 60%, #FFD93D 100%)',
        'gradient-button': 'linear-gradient(135deg, #DE9843 0%, #C8842E 50%, #FF6B9D 100%)',
      },
      backgroundSize: {
        '300%': '300% 300%',
        '200%': '200% 200%',
        '400%': '400% 400%',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

