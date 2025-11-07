'use client'

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-primary via-primary-dark to-primary-darker relative mt-auto border-t-3 border-primary/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-10 pb-4 sm:pb-5">
        <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_1.5fr] gap-6 sm:gap-8 md:gap-10 mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-primary/20">
          <div className="mb-6 sm:mb-0">
            <h3 className="text-white text-lg sm:text-xl font-bold mb-3 tracking-wide drop-shadow">Fun Club Games</h3>
            <p className="text-white/80 text-xs sm:text-sm">Making learning fun through interactive gameplay</p>
          </div>
          <div>
            <h4 className="text-accent text-sm sm:text-base font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 list-none">
              {['About Us', 'Privacy Policy', 'Terms of Service', 'Contact'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/70 text-xs sm:text-sm no-underline hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-accent text-sm sm:text-base font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 list-none">
              {['Help Center', 'Safety Guidelines', 'Parent Resources', 'FAQ'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-white/70 text-xs sm:text-sm no-underline hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-accent text-sm sm:text-base font-semibold mb-3">Connect With Us</h4>
            <div className="flex gap-3 sm:gap-4">
              {[
                { icon: 'github', url: 'https://github.com/muhammad-anas35/muhammad-anas35', label: 'GitHub' },
                { icon: 'facebook-f', url: 'https://www.facebook.com/Runingtech/', label: 'Facebook' },
                { icon: 'linkedin-in', url: 'https://www.linkedin.com/in/muhammad-anas35/', label: 'LinkedIn' },
                { icon: 'x-twitter', url: 'https://x.com/muhammad_anas35', label: 'Twitter' }
              ].map((social) => (
                <a
                  key={social.icon}
                  href={social.url}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-primary transition-all duration-300 hover:scale-110"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className={`fab fa-${social.icon} text-sm sm:text-base`}></i>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center text-white/50 text-xs sm:text-sm">
          <p className="mb-2 sm:mb-0">&copy; 2025 Fun Club Games. All rights reserved.</p>
          <div className="flex gap-2 items-center">
            {['Privacy', 'Terms', 'Cookies'].map((item, idx) => (
              <span key={item} className="flex items-center gap-2">
                <a href="#" className="hover:text-accent transition-colors">{item}</a>
                {idx < 2 && <span>•</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

