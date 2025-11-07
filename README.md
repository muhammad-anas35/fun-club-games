# Fun Club Games 
## Developed by ***Muhammad Anas***

### Tech stack
- MCP 
- Spec Driven Development 
- Ai Architect 

This project is build in Next.js with Tailwind CSS and React.

## Structure

```
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page component
│   └── globals.css         # Global styles with Tailwind
├── components/
│   ├── Navbar.tsx          # Navigation bar
│   ├── AuthContainer.tsx   # Login/Signup forms
│   ├── LandingPage.tsx     # Main dashboard
│   ├── Footer.tsx          # Footer component
│   └── games/              # Game modal components
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
├── public/
│   └── db.json            # Seed user data
└── package.json
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Build

```bash
npm run build
npm start
```

## Features

All original functionality is preserved:
- User authentication (login/signup)
- Landing page with stats
- 6 games: Snake & Ladder, Puzzle, Tic-Tac-Toe, Memory Match, Rock Paper Scissors, Quiz
- Activity feed
- Game history
- Leaderboard
- All animations and visual effects

## Notes

- All localStorage functionality is preserved
- All game logic is converted to React hooks
- All animations use Tailwind CSS classes
- Custom animations defined in tailwind.config.js

