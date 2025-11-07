'use client'

import { useState } from 'react'

interface AuthContainerProps {
  onLogin: (username: string) => void
}

export default function AuthContainer({ onLogin }: AuthContainerProps) {
  const [showSignup, setShowSignup] = useState(false)
  const [loginMessage, setLoginMessage] = useState({ text: '', type: '' })
  const [signupMessage, setSignupMessage] = useState({ text: '', type: '' })

  const showMessage = (setter: typeof setLoginMessage, message: string, type: string) => {
    setter({ text: message, type })
    setTimeout(() => setter({ text: '', type: '' }), 3000)
  }

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const username = (formData.get('username') as string)?.trim()
    const email = (formData.get('email') as string)?.trim()
    const password = (formData.get('password') as string)?.trim()

    if (!username || !email || !password) {
      showMessage(setSignupMessage, 'Oops! Looks like you missed a spot!', 'error')
      return
    }

    if (password.length < 6) {
      showMessage(setSignupMessage, 'Your password needs to be a little longer!', 'error')
      return
    }

    if (typeof window !== 'undefined' && localStorage.getItem(email)) {
      showMessage(setSignupMessage, 'Someone already has this email! Try another.', 'error')
      return
    }

    const userData = { username, password }
    if (typeof window !== 'undefined') {
      localStorage.setItem(email, JSON.stringify(userData))
    }
    
    showMessage(setSignupMessage, 'Awesome! You\'re all signed up!', 'success')
    e.currentTarget.reset()
    
    setTimeout(() => {
      setShowSignup(false)
      setSignupMessage({ text: '', type: '' })
    }, 2000)
  }

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = (formData.get('email') as string)?.trim()
    const password = (formData.get('password') as string)?.trim()

    if (!email || !password) {
      showMessage(setLoginMessage, 'Oops! Looks like you missed a spot!', 'error')
      return
    }

    if (typeof window === 'undefined') return

    const userData = localStorage.getItem(email)

    if (userData) {
      const user = JSON.parse(userData)
      if (user.password === password) {
        showMessage(setLoginMessage, 'Yay! You\'re logged in!', 'success')
        e.currentTarget.reset()
        
        localStorage.setItem('currentUser', JSON.stringify({
          email: email,
          username: user.username
        }))
        
        setTimeout(() => {
          onLogin(user.username)
        }, 1500)
      } else {
        showMessage(setLoginMessage, 'Hmm, that password doesn\'t look right.', 'error')
      }
    } else {
      showMessage(setLoginMessage, 'We couldn\'t find you! Are you sure you signed up?', 'error')
    }
  }



  return (
    <div className="w-full max-w-[400px] sm:w-[400px] glass-effect rounded-3xl p-6 sm:p-10 mx-4 sm:mx-auto my-10 flex-1 relative z-10 transition-all duration-300 animate-container-float border-3 border-primary/30 shadow-2xl">
      <div className="absolute -inset-1 bg-gradient-to-r from-primary via-secondary to-accent to-primary rounded-3xl -z-10 opacity-30 animate-border-glow blur-sm"></div>
      
      {!showSignup ? (
        <div className="form-container">
          <h1 className="text-center mb-8 text-primary text-2xl sm:text-4xl md:text-5xl font-bold drop-shadow-sm">Welcome Back!</h1>
          {loginMessage.text && (
            <div className={`text-center p-3 mb-5 rounded-2xl text-base sm:text-lg ${loginMessage.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
              {loginMessage.text}
            </div>
          )}
          <form onSubmit={handleLogin} id="login">
            <div className="relative mb-6">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-primary text-base sm:text-2xl"></i>
              <input
                type="email"
                name="email"
                id="login-email"
                placeholder="Your Email"
                required
                className="w-full py-3 sm:py-4 pl-14 pr-4 border-3 border-primary/30 rounded-full outline-none text-base sm:text-xl text-primary bg-background-light transition-all duration-300 focus:border-primary focus:shadow-lg"
              />
            </div>
            <div className="relative mb-6">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-primary text-base sm:text-2xl"></i>
              <input
                type="password"
                name="password"
                id="login-password"
                placeholder="Your Password"
                required
                className="w-full py-3 sm:py-4 pl-14 pr-4 border-3 border-primary/30 rounded-full outline-none text-base sm:text-xl text-primary bg-background-light transition-all duration-300 focus:border-primary focus:shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-primary to-primary-dark text-white border-none rounded-full cursor-pointer text-lg sm:text-2xl font-semibold transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
            >
              Let's Go!
            </button>
          </form>
          <p className="text-center mt-5 text-primary text-base sm:text-lg">
            No account yet?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setShowSignup(true)
                setLoginMessage({ text: '', type: '' })
              }}
              className="text-primary-dark font-semibold no-underline transition-all duration-300 hover:text-primary-darker hover:underline"
            >
              Join the fun!
            </a>
          </p>
        </div>
      ) : (
        <div className="form-container">
          <h1 className="text-center mb-8 text-primary text-2xl sm:text-4xl md:text-5xl font-bold drop-shadow-sm">Join the Fun!</h1>
          {signupMessage.text && (
            <div className={`text-center p-3 mb-5 rounded-2xl text-base sm:text-lg ${signupMessage.type === 'success' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
              {signupMessage.text}
            </div>
          )}
          <form onSubmit={handleSignup} id="signup">
            <div className="relative mb-6">
              <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-primary text-base sm:text-2xl"></i>
              <input
                type="text"
                name="username"
                id="signup-username"
                placeholder="Choose a Username"
                required
                className="w-full py-3 sm:py-4 pl-14 pr-4 border-3 border-primary/30 rounded-full outline-none text-base sm:text-xl text-primary bg-background-light transition-all duration-300 focus:border-primary focus:shadow-lg"
              />
            </div>
            <div className="relative mb-6">
              <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-primary text-base sm:text-2xl"></i>
              <input
                type="email"
                name="email"
                id="signup-email"
                placeholder="Your Email"
                required
                className="w-full py-3 sm:py-4 pl-14 pr-4 border-3 border-primary/30 rounded-full outline-none text-base sm:text-xl text-primary bg-background-light transition-all duration-300 focus:border-primary focus:shadow-lg"
              />
            </div>
            <div className="relative mb-6">
              <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-primary text-base sm:text-2xl"></i>
              <input
                type="password"
                name="password"
                id="signup-password"
                placeholder="Create a Password"
                required
                className="w-full py-3 sm:py-4 pl-14 pr-4 border-3 border-primary/30 rounded-full outline-none text-base sm:text-xl text-primary bg-background-light transition-all duration-300 focus:border-primary focus:shadow-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 sm:py-4 bg-gradient-to-r from-primary to-primary-dark text-white border-none rounded-full cursor-pointer text-lg sm:text-2xl font-semibold transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-xl"
            >
              Sign Me Up!
            </button>
          </form>
          <p className="text-center mt-5 text-primary text-base sm:text-lg">
            Already have an account?{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                setShowSignup(false)
                setSignupMessage({ text: '', type: '' })
              }}
              className="text-primary-dark font-semibold no-underline transition-all duration-300 hover:text-primary-darker hover:underline"
            >
              Log in!
            </a>
          </p>
        </div>
      )}
    </div>
  )
}

