const loginFormContainer = document.getElementById('login-form');
const signupFormContainer = document.getElementById('signup-form');
const signupLink = document.getElementById('signup-link');
const loginLink = document.getElementById('login-link');
const loginForm = document.getElementById('login');
const signupForm = document.getElementById('signup');
const loginMessage = document.getElementById('login-message');
const signupMessage = document.getElementById('signup-message');

const showMessage = (element, message, type) => {
    element.textContent = message;
    element.className = `message ${type}`;
    element.style.display = 'block';
};

const loadUsers = async () => {
    try {
        const response = await fetch('db.json');
        const data = await response.json();
        data.users.forEach(user => {
            if (!localStorage.getItem(user.email)) {
                localStorage.setItem(user.email, JSON.stringify({
                    username: user.username,
                    password: user.password
                }));
            }
        });
    } catch (error) {
        console.error('Error loading users from db.json:', error);
    }
};

window.addEventListener('DOMContentLoaded', loadUsers);

signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginFormContainer.style.display = 'none';
    signupFormContainer.style.display = 'block';
    loginMessage.style.display = 'none';
});

loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    signupFormContainer.style.display = 'none';
    loginFormContainer.style.display = 'block';
    signupMessage.style.display = 'none';
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    if (!username || !email || !password) {
        showMessage(signupMessage, 'Oops! Looks like you missed a spot!', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage(signupMessage, 'Your password needs to be a little longer!', 'error');
        return;
    }

    if (localStorage.getItem(email)) {
        showMessage(signupMessage, 'Someone already has this email! Try another.', 'error');
        return;
    }

    const userData = { username, password };
    localStorage.setItem(email, JSON.stringify(userData));
    
    showMessage(signupMessage, 'Awesome! You\'re all signed up!', 'success');
    signupForm.reset();
    
    setTimeout(() => {
        signupFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
        signupMessage.style.display = 'none';
    }, 2000);
});



loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    if (!email || !password) {
        showMessage(loginMessage, 'Oops! Looks like you missed a spot!', 'error');
        return;
    }

    const userData = localStorage.getItem(email);

    if (userData) {
        const user = JSON.parse(userData);
        if (user.password === password) {
            showMessage(loginMessage, 'Yay! You\'re logged in!', 'success');
            loginForm.reset();
            
            // Store logged in user
            localStorage.setItem('currentUser', JSON.stringify({
                email: email,
                username: user.username
            }));
            
            // Show landing page after a short delay
            setTimeout(() => {
                showLandingPage(user.username);
            }, 1500);
        } else {
            showMessage(loginMessage, 'Hmm, that password doesn\'t look right.', 'error');
        }
    } else {
        showMessage(loginMessage, 'We couldn\'t find you! Are you sure you signed up?', 'error');
    }
});

const showLandingPage = (username) => {
    const authContainer = document.getElementById('auth-container');
    const landingPage = document.getElementById('landing-page');
    
    authContainer.style.display = 'none';
    landingPage.style.display = 'block';
    
    // Update username display
    document.getElementById('username-display').textContent = username;
    
    // Load user stats
    loadUserStats();
    
    // Load activity feed
    loadActivityFeed();
    
    // Update day streak
    updateDayStreak();
    
    // Setup all event listeners
    setupLandingPageEvents();
};

const loadUserStats = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const userEmail = currentUser.email;
    const userStatsKey = `userStats_${userEmail}`;
    
    // Load stats from localStorage or set defaults
    const stats = JSON.parse(localStorage.getItem(userStatsKey)) || {
        games: 0,
        achievements: 0,
        streak: 1,
        lastPlayDate: null
    };
    
    document.getElementById('stat-games').textContent = stats.games || 0;
    document.getElementById('stat-achievements').textContent = stats.achievements || 0;
    document.getElementById('stat-streak').textContent = stats.streak || 1;
};

const updateDayStreak = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const userEmail = currentUser.email;
    const userStatsKey = `userStats_${userEmail}`;
    const stats = JSON.parse(localStorage.getItem(userStatsKey)) || {
        streak: 1,
        lastPlayDate: null
    };
    
    const today = new Date().toDateString();
    const lastDate = stats.lastPlayDate ? new Date(stats.lastPlayDate).toDateString() : null;
    
    if (lastDate === today) {
        // Already played today, keep streak
        return;
    } else if (lastDate) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (lastDate === yesterdayStr) {
            // Consecutive day, increment streak
            stats.streak = (stats.streak || 1) + 1;
        } else {
            // Streak broken, reset to 1
            stats.streak = 1;
        }
    }
    
    stats.lastPlayDate = new Date().toISOString();
    localStorage.setItem(userStatsKey, JSON.stringify(stats));
    document.getElementById('stat-streak').textContent = stats.streak;
};

const incrementGameCount = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const userEmail = currentUser.email;
    const userStatsKey = `userStats_${userEmail}`;
    const stats = JSON.parse(localStorage.getItem(userStatsKey)) || {
        games: 0,
        achievements: 0,
        streak: 1
    };
    
    stats.games = (stats.games || 0) + 1;
    localStorage.setItem(userStatsKey, JSON.stringify(stats));
    document.getElementById('stat-games').textContent = stats.games;
    
    // Check for achievements
    checkAchievements(stats);
};

const checkAchievements = (stats) => {
    const achievements = [];
    if (stats.games >= 1) achievements.push('First Game!');
    if (stats.games >= 10) achievements.push('10 Games Played!');
    if (stats.games >= 50) achievements.push('50 Games Master!');
    if (stats.streak >= 7) achievements.push('Week Warrior!');
    if (stats.streak >= 30) achievements.push('Monthly Champion!');
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userEmail = currentUser.email;
    const userStatsKey = `userStats_${userEmail}`;
    const statsData = JSON.parse(localStorage.getItem(userStatsKey)) || {};
    
    statsData.achievements = achievements.length;
    localStorage.setItem(userStatsKey, JSON.stringify(statsData));
    document.getElementById('stat-achievements').textContent = achievements.length;
    
    if (achievements.length > (statsData.achievementCount || 0)) {
        addActivity(`🎉 New Achievement: ${achievements[achievements.length - 1]}`, 'success');
        statsData.achievementCount = achievements.length;
        localStorage.setItem(userStatsKey, JSON.stringify(statsData));
    }
};

const addActivity = (message, type = 'info') => {
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    
    const activityItem = document.createElement('div');
    activityItem.className = 'activity-item';
    
    const icons = {
        success: 'fa-check-circle',
        info: 'fa-info-circle',
        game: 'fa-gamepad',
        trophy: 'fa-trophy'
    };
    
    const iconClass = icons[type] || icons.info;
    
    activityItem.innerHTML = `
        <i class="fas ${iconClass}"></i>
        <div class="activity-content">
            <p><strong>${message}</strong></p>
            <span class="activity-time">Just now</span>
        </div>
    `;
    
    activityList.insertBefore(activityItem, activityList.firstChild);
    
    // Keep only last 10 activities
    while (activityList.children.length > 10) {
        activityList.removeChild(activityList.lastChild);
    }
};

const loadActivityFeed = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const userEmail = currentUser.email;
    const activitiesKey = `activities_${userEmail}`;
    const activities = JSON.parse(localStorage.getItem(activitiesKey)) || [];
    
    const activityList = document.getElementById('activity-list');
    if (!activityList) return;
    
    // Clear existing activities except welcome message
    const welcomeItem = activityList.querySelector('.activity-item');
    activityList.innerHTML = '';
    if (welcomeItem) {
        activityList.appendChild(welcomeItem);
    }
    
    // Add stored activities (limit to 9 more)
    activities.slice(0, 9).forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <i class="fas ${activity.icon || 'fa-info-circle'}"></i>
            <div class="activity-content">
                <p><strong>${activity.message}</strong></p>
                <span class="activity-time">${activity.time}</span>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
};

const saveActivity = (message, icon = 'fa-info-circle') => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const userEmail = currentUser.email;
    const activitiesKey = `activities_${userEmail}`;
    const activities = JSON.parse(localStorage.getItem(activitiesKey)) || [];
    
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    activities.unshift({
        message: message,
        icon: icon,
        time: timeString,
        timestamp: now.toISOString()
    });
    
    // Keep only last 20 activities
    if (activities.length > 20) {
        activities.pop();
    }
    
    localStorage.setItem(activitiesKey, JSON.stringify(activities));
    addActivity(message, icon.includes('trophy') ? 'trophy' : icon.includes('check') ? 'success' : 'info');
};

const setupLandingPageEvents = () => {
    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = () => {
            localStorage.removeItem('currentUser');
            const authContainer = document.getElementById('auth-container');
            const landingPage = document.getElementById('landing-page');
            authContainer.style.display = 'block';
            landingPage.style.display = 'none';
            document.getElementById('login-form').style.display = 'block';
        };
    }
    
    // Setup action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.getAttribute('data-action');
            handleAction(action);
        });
    });
    
    // Setup navbar links
    const navLinks = document.querySelectorAll('.nav-link-fun');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const linkText = link.querySelector('span')?.textContent || link.textContent.trim();
            handleNavLink(linkText);
        });
    });
};

const handleAction = (action) => {
    switch(action) {
        case 'play-game':
            playSnakeLadder();
            break;
        case 'puzzle-games':
            showPuzzleGames();
            break;
        case 'tictactoe':
            playTicTacToe();
            break;
        case 'memory-game':
            playMemoryGame();
            break;
        case 'rock-paper-scissors':
            playRockPaperScissors();
            break;
        case 'quiz-game':
            playQuizGame();
            break;
        case 'game-history':
            showGameHistory();
            break;
        case 'multiplayer':
            showMultiplayer();
            break;
        case 'settings':
            showSettings();
            break;
        default:
            console.log('Action:', action);
    }
};

const playSnakeLadder = () => {
    incrementGameCount();
    saveActivity('🎲 Started playing Snake & Ladder!', 'fa-dice');
    
    // Show game modal
    const gameModal = document.getElementById('snake-ladder-modal');
    gameModal.style.display = 'flex';
    
    // Initialize game
    initSnakeLadderGame();
};

const showPuzzleGames = () => {
    saveActivity('🧩 Started playing Puzzle Game!', 'fa-puzzle-piece');
    
    // Show puzzle game modal
    const puzzleModal = document.getElementById('puzzle-modal');
    puzzleModal.style.display = 'flex';
    
    // Initialize puzzle game
    initPuzzleGame();
};

const showMultiplayer = () => {
    saveActivity('👥 Opened Multiplayer section', 'fa-users');
    
    const multiplayerMessage = `
        👥 Multiplayer Games
        
        • Create a game room
        • Join friend's room
        • Play with random players
        • Challenge friends
        
        Multiplayer features coming soon!
    `;
    
    alert(multiplayerMessage);
    addActivity('👥 Accessed Multiplayer section', 'info');
};

const showSettings = () => {
    const settingsMessage = `
        ⚙️ Settings
        
        Profile Settings:
        • Change username
        • Update email
        • Change password
        • Privacy settings
        
        Game Settings:
        • Sound effects
        • Music volume
        • Theme preferences
        
        Settings panel coming soon!
    `;
    
    alert(settingsMessage);
    saveActivity('⚙️ Opened Settings', 'fa-cog');
};

const handleNavLink = (linkText) => {
    switch(linkText.toLowerCase()) {
        case 'home':
            window.scrollTo({ top: 0, behavior: 'smooth' });
            saveActivity('🏠 Navigated to Home', 'fa-home');
            break;
        case 'games':
            const quickActionsSection = document.querySelector('.quick-actions');
            if (quickActionsSection) {
                window.scrollTo({ top: quickActionsSection.offsetTop - 100, behavior: 'smooth' });
                saveActivity('🎮 Viewed Games section', 'fa-gamepad');
            } else {
                // If on login page, navigate to landing page first
                const currentUser = JSON.parse(localStorage.getItem('currentUser'));
                if (currentUser) {
                    // User is logged in but on wrong page, redirect to landing
                    showLandingPage(currentUser.username);
                    setTimeout(() => {
                        const landingQuickActions = document.querySelector('.quick-actions');
                        if (landingQuickActions) {
                            window.scrollTo({ top: landingQuickActions.offsetTop - 100, behavior: 'smooth' });
                            saveActivity('🎮 Viewed Games section', 'fa-gamepad');
                        }
                    }, 100);
                } else {
                    // User needs to log in first
                    alert('Please log in to access games!');
                    saveActivity('⚠️ Attempted to access games without login', 'fa-info-circle');
                }
            }
            break;
        case 'leaderboard':
            const currentUserForLeaderboard = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUserForLeaderboard) {
                showLeaderboard();
            } else {
                alert('Please log in to view leaderboard!');
                saveActivity('⚠️ Attempted to access leaderboard without login', 'fa-info-circle');
            }
            break;
        case 'profile':
            const currentUserForProfile = JSON.parse(localStorage.getItem('currentUser'));
            if (currentUserForProfile) {
                showProfile();
            } else {
                alert('Please log in to view profile!');
                saveActivity('⚠️ Attempted to access profile without login', 'fa-info-circle');
            }
            break;
    }
};

const showLeaderboard = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Get all users and their stats
    const allUsers = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('userStats_')) {
            const email = key.replace('userStats_', '');
            const stats = JSON.parse(localStorage.getItem(key));
            const userData = localStorage.getItem(email);
            if (userData) {
                const user = JSON.parse(userData);
                allUsers.push({
                    username: user.username,
                    games: stats.games || 0,
                    achievements: stats.achievements || 0,
                    streak: stats.streak || 0
                });
            }
        }
    }
    
    // Sort by games played
    allUsers.sort((a, b) => b.games - a.games);
    
    let leaderboardHTML = '🏆 Leaderboard\n\n';
    if (allUsers.length === 0) {
        leaderboardHTML += 'No players yet! Be the first!';
    } else {
        allUsers.slice(0, 10).forEach((user, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
            leaderboardHTML += `${medal} ${user.username} - ${user.games} games, ${user.achievements} achievements, ${user.streak} day streak\n`;
        });
    }
    
    alert(leaderboardHTML);
    saveActivity('🏆 Checked Leaderboard', 'fa-trophy');
};

const showProfile = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const userData = JSON.parse(localStorage.getItem(currentUser.email));
    const userStatsKey = `userStats_${currentUser.email}`;
    const stats = JSON.parse(localStorage.getItem(userStatsKey)) || {};
    
    const profileInfo = `
        👤 Profile Information
        
        Username: ${userData.username}
        Email: ${currentUser.email}
        
        Statistics:
        • Games Played: ${stats.games || 0}
        • Achievements: ${stats.achievements || 0}
        • Day Streak: ${stats.streak || 1}
        
        Profile editing coming soon!
    `;
    
    alert(profileInfo);
    saveActivity('👤 Viewed Profile', 'fa-user');
};

// Game Functions
const closeGame = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
};

// Snake & Ladder Game
let playerPos = 1;
const snakes = {
    16: 6, 46: 25, 49: 11, 62: 19, 64: 60, 74: 53, 89: 68, 92: 88, 95: 75, 99: 80
};
const ladders = {
    2: 38, 7: 14, 8: 31, 15: 26, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 78: 98
};

const initSnakeLadderGame = () => {
    playerPos = 1;
    document.getElementById('player-position').textContent = playerPos;
    document.getElementById('game-status').textContent = 'Ready to play! Roll the dice to start.';
    document.getElementById('roll-dice-btn').disabled = false;
    
    // Create board
    createSnakeLadderBoard();
    
    // Setup roll dice button
    const rollBtn = document.getElementById('roll-dice-btn');
    rollBtn.onclick = rollDice;
};

const createSnakeLadderBoard = () => {
    const boardGrid = document.getElementById('board-grid');
    boardGrid.innerHTML = '';
    
    // Create 100 cells in zigzag pattern (like real board game)
    // Rows alternate direction: 100-91 (right to left), 81-90 (left to right), etc.
    for (let row = 9; row >= 0; row--) {
        const isEvenRow = row % 2 === 0;
        const startNum = row * 10 + 1;
        const endNum = (row + 1) * 10;
        
        if (isEvenRow) {
            // Right to left
            for (let i = endNum; i >= startNum; i--) {
                createBoardCell(i, boardGrid);
            }
        } else {
            // Left to right
            for (let i = startNum; i <= endNum; i++) {
                createBoardCell(i, boardGrid);
            }
        }
    }
    
    updatePlayerPosition();
};

const createBoardCell = (num, container) => {
    const cell = document.createElement('div');
    cell.className = 'board-cell';
    cell.id = `cell-${num}`;
    
    // Create cell content
    const cellNumber = document.createElement('span');
    cellNumber.className = 'cell-number';
    cellNumber.textContent = num;
    cell.appendChild(cellNumber);
    
    // Check for snakes
    if (snakes[num]) {
        cell.classList.add('snake-tail');
        cell.title = `🐍 Snake! Slides down to ${snakes[num]}`;
        const snakeIcon = document.createElement('span');
        snakeIcon.className = 'snake-icon';
        snakeIcon.textContent = '🐍';
        snakeIcon.title = `Snake to ${snakes[num]}`;
        cell.appendChild(snakeIcon);
    }
    
    // Check for ladders
    if (ladders[num]) {
        cell.classList.add('ladder-bottom');
        cell.title = `🎉 Ladder! Climb up to ${ladders[num]}`;
        const ladderIcon = document.createElement('span');
        ladderIcon.className = 'ladder-icon';
        ladderIcon.textContent = '🎉';
        ladderIcon.title = `Ladder to ${ladders[num]}`;
        cell.appendChild(ladderIcon);
    }
    
    container.appendChild(cell);
};

const rollDice = () => {
    const rollBtn = document.getElementById('roll-dice-btn');
    rollBtn.disabled = true;
    
    // Animate dice
    const dice = document.getElementById('dice');
    const diceFace = document.getElementById('dice-face');
    let rollCount = 0;
    const rollInterval = setInterval(() => {
        const randomNum = Math.floor(Math.random() * 6) + 1;
        diceFace.textContent = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][randomNum - 1];
        rollCount++;
        if (rollCount >= 10) {
            clearInterval(rollInterval);
            const finalRoll = Math.floor(Math.random() * 6) + 1;
            diceFace.textContent = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'][finalRoll - 1];
            movePlayer(finalRoll);
        }
    }, 100);
};

const movePlayer = (steps) => {
    const startPos = playerPos;
    const targetPos = Math.min(playerPos + steps, 100);
    
    // Animate movement step by step
    animatePlayerMovement(startPos, targetPos, () => {
        playerPos = targetPos;
        
        // Check for ladders
        if (ladders[playerPos]) {
            const ladderDest = ladders[playerPos];
            document.getElementById('game-status').textContent = `🎉 Ladder! Climbing to ${ladderDest}!`;
            animateLadderClimb(playerPos, ladderDest);
        }
        // Check for snakes
        else if (snakes[playerPos]) {
            const oldPos = playerPos;
            const snakeDest = snakes[playerPos];
            document.getElementById('game-status').textContent = `🐍 Snake! Sliding down to ${snakeDest}!`;
            animateSnakeSlide(oldPos, snakeDest);
        } else {
            updatePlayerPosition();
            checkGameEnd();
        }
    });
};

const animatePlayerMovement = (start, end, callback) => {
    let current = start;
    const step = start < end ? 1 : -1;
    const interval = setInterval(() => {
        current += step;
        playerPos = current;
        updatePlayerPosition();
        
        if (current === end) {
            clearInterval(interval);
            setTimeout(callback, 300);
        }
    }, 150);
};

const animateLadderClimb = (from, to) => {
    setTimeout(() => {
        playerPos = to;
        updatePlayerPosition();
        document.getElementById('game-status').textContent = `🎉 Climbed to position ${to}!`;
        checkGameEnd();
    }, 800);
};

const animateSnakeSlide = (from, to) => {
    setTimeout(() => {
        playerPos = to;
        updatePlayerPosition();
        document.getElementById('game-status').textContent = `🐍 Slid down to position ${to}!`;
        checkGameEnd();
    }, 800);
};

const checkGameEnd = () => {
    if (playerPos === 100) {
        document.getElementById('game-status').textContent = '🎉 Congratulations! You won!';
        document.getElementById('roll-dice-btn').disabled = true;
        saveActivity('🏆 Won Snake & Ladder game!', 'fa-trophy');
        
        // Show confetti effect
        showConfetti();
        
        setTimeout(() => {
            closeGame('snake-ladder-modal');
        }, 3000);
    } else {
        document.getElementById('roll-dice-btn').disabled = false;
        if (!document.getElementById('game-status').textContent.includes('Ladder') && 
            !document.getElementById('game-status').textContent.includes('Snake')) {
            document.getElementById('game-status').textContent = `Moved to position ${playerPos}. Roll again!`;
        }
    }
};

const updatePlayerPosition = () => {
    document.getElementById('player-position').textContent = playerPos;
    
    // Remove player from all cells with animation
    document.querySelectorAll('.board-cell').forEach(cell => {
        cell.classList.remove('player-here', 'player-moving');
    });
    
    // Add player to current cell with animation
    const currentCell = document.getElementById(`cell-${playerPos}`);
    if (currentCell) {
        currentCell.classList.add('player-here');
        
        // Scroll to cell if needed
        currentCell.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
};

const showConfetti = () => {
    const confettiCount = 50;
    const colors = ['#DE9843', '#C8842E', '#FFD93D', '#FF6B9D', '#51CF66'];
    const gameContainer = document.querySelector('.game-modal-body') || document.body;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.width = (Math.random() * 10 + 5) + 'px';
            confetti.style.height = (Math.random() * 10 + 5) + 'px';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';
            confetti.style.zIndex = '9999';
            gameContainer.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 20);
    }
};

// Puzzle Game
let puzzleNumbers = [];
let emptyIndex = 8;
let moves = 0;

const initPuzzleGame = () => {
    moves = 0;
    document.getElementById('puzzle-moves').textContent = moves;
    
    // Create shuffled numbers (1-8, empty at 9)
    puzzleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, null];
    shuffleArray(puzzleNumbers);
    
    // Find empty index
    emptyIndex = puzzleNumbers.indexOf(null);
    
    createPuzzleGrid();
    
    // Setup reset button
    document.getElementById('reset-puzzle-btn').onclick = () => {
        initPuzzleGame();
    };
};

const shuffleArray = (array) => {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const createPuzzleGrid = () => {
    const puzzleGrid = document.getElementById('puzzle-grid');
    puzzleGrid.innerHTML = '';
    
    puzzleNumbers.forEach((num, index) => {
        const cell = document.createElement('div');
        cell.className = 'puzzle-cell';
        cell.textContent = num || '';
        cell.onclick = () => movePuzzlePiece(index);
        
        if (!num) {
            cell.classList.add('empty');
        }
        
        puzzleGrid.appendChild(cell);
    });
};

const movePuzzlePiece = (index) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const emptyRow = Math.floor(emptyIndex / 3);
    const emptyCol = emptyIndex % 3;
    
    // Check if adjacent to empty cell
    const isAdjacent = (Math.abs(row - emptyRow) === 1 && col === emptyCol) ||
                      (Math.abs(col - emptyCol) === 1 && row === emptyRow);
    
    if (isAdjacent) {
        // Animate the swap
        const cell = document.querySelector(`#puzzle-grid > div:nth-child(${index + 1})`);
        const emptyCell = document.querySelector(`#puzzle-grid > div:nth-child(${emptyIndex + 1})`);
        
        if (cell && emptyCell) {
            cell.style.transition = 'transform 0.3s ease';
            emptyCell.style.transition = 'transform 0.3s ease';
            
            // Calculate positions
            const cellRect = cell.getBoundingClientRect();
            const emptyRect = emptyCell.getBoundingClientRect();
            const dx = emptyRect.left - cellRect.left;
            const dy = emptyRect.top - cellRect.top;
            
            cell.style.transform = `translate(${dx}px, ${dy}px)`;
            emptyCell.style.transform = `translate(${-dx}px, ${-dy}px)`;
            
            setTimeout(() => {
                // Swap pieces
                [puzzleNumbers[index], puzzleNumbers[emptyIndex]] = [puzzleNumbers[emptyIndex], puzzleNumbers[index]];
                emptyIndex = index;
                moves++;
                
                document.getElementById('puzzle-moves').textContent = moves;
                createPuzzleGrid();
                
                // Check if solved
                if (isPuzzleSolved()) {
                    document.getElementById('puzzle-moves').textContent = `Solved in ${moves} moves! 🎉`;
                    saveActivity(`🧩 Solved puzzle in ${moves} moves!`, 'fa-trophy');
                    showConfetti();
                    
                    setTimeout(() => {
                        closeGame('puzzle-modal');
                    }, 2000);
                }
            }, 300);
        }
    }
};

const isPuzzleSolved = () => {
    for (let i = 0; i < puzzleNumbers.length - 1; i++) {
        if (puzzleNumbers[i] !== i + 1) {
            return false;
        }
    }
    return puzzleNumbers[puzzleNumbers.length - 1] === null;
};

// Tic-Tac-Toe Game
let tictactoeBoard = Array(9).fill(null);
let tictactoeCurrentPlayer = 'X';
let tictactoePlayerScore = 0;
let tictactoeComputerScore = 0;
let tictactoeGameOver = false;

const playTicTacToe = () => {
    incrementGameCount();
    saveActivity('❌ Started playing Tic-Tac-Toe!', 'fa-times');
    
    const modal = document.getElementById('tictactoe-modal');
    modal.style.display = 'flex';
    initTicTacToe();
};

const initTicTacToe = () => {
    tictactoeBoard = Array(9).fill(null);
    tictactoeCurrentPlayer = 'X';
    tictactoeGameOver = false;
    
    // Load scores
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const scoresKey = `tictactoe_scores_${currentUser.email}`;
        const scores = JSON.parse(localStorage.getItem(scoresKey)) || { player: 0, computer: 0 };
        tictactoePlayerScore = scores.player || 0;
        tictactoeComputerScore = scores.computer || 0;
    }
    
    document.getElementById('player-score').textContent = tictactoePlayerScore;
    document.getElementById('computer-score').textContent = tictactoeComputerScore;
    document.getElementById('current-player').textContent = 'Your turn (❌)';
    
    createTicTacToeGrid();
    
    document.getElementById('reset-tictactoe-btn').onclick = () => {
        tictactoeBoard = Array(9).fill(null);
        tictactoeCurrentPlayer = 'X';
        tictactoeGameOver = false;
        createTicTacToeGrid();
        document.getElementById('current-player').textContent = 'Your turn (❌)';
    };
};

const createTicTacToeGrid = () => {
    const grid = document.getElementById('tictactoe-grid');
    grid.innerHTML = '';
    
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'tictactoe-cell';
        cell.dataset.index = i;
        cell.textContent = tictactoeBoard[i] === 'X' ? '❌' : tictactoeBoard[i] === 'O' ? '⭕' : '';
        cell.onclick = () => handleTicTacToeClick(i);
        grid.appendChild(cell);
    }
};

const handleTicTacToeClick = (index) => {
    if (tictactoeBoard[index] || tictactoeGameOver || tictactoeCurrentPlayer !== 'X') return;
    
    // Add click animation
    const cell = document.querySelector(`[data-index="${index}"]`);
    if (cell) {
        cell.style.transform = 'scale(0)';
    }
    
    setTimeout(() => {
        tictactoeBoard[index] = 'X';
        createTicTacToeGrid();
        
        // Animate cell appearance
        const newCell = document.querySelector(`[data-index="${index}"]`);
        if (newCell) {
            newCell.style.animation = 'cellAppear 0.3s ease';
        }
        
        const winner = checkTicTacToeWinner('X');
        if (winner) {
            tictactoeGameOver = true;
            tictactoePlayerScore++;
            saveScore('tictactoe', tictactoePlayerScore, tictactoeComputerScore);
            document.getElementById('player-score').textContent = tictactoePlayerScore;
            document.getElementById('current-player').textContent = '🎉 You Win!';
            saveActivity('🏆 Won Tic-Tac-Toe game!', 'fa-trophy');
            highlightWinningLine(winner);
            showConfetti();
            return;
        }
        
        if (isTicTacToeBoardFull()) {
            tictactoeGameOver = true;
            document.getElementById('current-player').textContent = "It's a Draw!";
            return;
        }
        
        tictactoeCurrentPlayer = 'O';
        document.getElementById('current-player').textContent = 'Computer thinking...';
        
        setTimeout(() => {
            computerTicTacToeMove();
        }, 800);
    }, 200);
};

const computerTicTacToeMove = () => {
    // Simple AI: Try to win, then block, then random
    let move = -1;
    
    // Try to win
    for (let i = 0; i < 9; i++) {
        if (!tictactoeBoard[i]) {
            tictactoeBoard[i] = 'O';
            if (checkTicTacToeWinner('O')) {
                move = i;
                tictactoeBoard[i] = null;
                break;
            }
            tictactoeBoard[i] = null;
        }
    }
    
    // Block player
    if (move === -1) {
        for (let i = 0; i < 9; i++) {
            if (!tictactoeBoard[i]) {
                tictactoeBoard[i] = 'X';
                if (checkTicTacToeWinner('X')) {
                    move = i;
                    tictactoeBoard[i] = null;
                    break;
                }
                tictactoeBoard[i] = null;
            }
        }
    }
    
    // Random move
    if (move === -1) {
        const available = [];
        for (let i = 0; i < 9; i++) {
            if (!tictactoeBoard[i]) available.push(i);
        }
        move = available[Math.floor(Math.random() * available.length)];
    }
    
    // Animate computer move
    const cell = document.querySelector(`[data-index="${move}"]`);
    if (cell) {
        cell.style.transform = 'scale(0)';
    }
    
    setTimeout(() => {
        tictactoeBoard[move] = 'O';
        createTicTacToeGrid();
        
        // Animate cell appearance
        const newCell = document.querySelector(`[data-index="${move}"]`);
        if (newCell) {
            newCell.style.animation = 'cellAppear 0.3s ease';
        }
        
        const winner = checkTicTacToeWinner('O');
        if (winner) {
            tictactoeGameOver = true;
            tictactoeComputerScore++;
            saveScore('tictactoe', tictactoePlayerScore, tictactoeComputerScore);
            document.getElementById('computer-score').textContent = tictactoeComputerScore;
            document.getElementById('current-player').textContent = '🤖 Computer Wins!';
            highlightWinningLine(winner);
            return;
        }
        
        if (isTicTacToeBoardFull()) {
            tictactoeGameOver = true;
            document.getElementById('current-player').textContent = "It's a Draw!";
            return;
        }
        
        tictactoeCurrentPlayer = 'X';
        document.getElementById('current-player').textContent = 'Your turn (❌)';
    }, 300);
};

const checkTicTacToeWinner = (player) => {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (let pattern of winPatterns) {
        if (pattern.every(index => tictactoeBoard[index] === player)) {
            return pattern; // Return winning pattern
        }
    }
    return null;
};

const highlightWinningLine = (winPattern) => {
    winPattern.forEach(index => {
        const cell = document.querySelector(`[data-index="${index}"]`);
        if (cell) {
            cell.classList.add('winning-cell');
        }
    });
};

const isTicTacToeBoardFull = () => {
    return tictactoeBoard.every(cell => cell !== null);
};

// Memory Match Game
let memoryCards = [];
let memoryFlippedCards = [];
let memoryMatches = 0;
let memoryMoves = 0;
let memoryCanFlip = true;

const playMemoryGame = () => {
    incrementGameCount();
    saveActivity('🧠 Started playing Memory Match!', 'fa-brain');
    
    const modal = document.getElementById('memory-modal');
    modal.style.display = 'flex';
    initMemoryGame();
};

const initMemoryGame = () => {
    memoryMatches = 0;
    memoryMoves = 0;
    memoryFlippedCards = [];
    memoryCanFlip = true;
    
    const symbols = ['🎮', '🎲', '🎯', '🎨', '⭐', '🎪', '🎭', '🎸'];
    memoryCards = [...symbols, ...symbols];
    shuffleArray(memoryCards);
    
    document.getElementById('memory-moves').textContent = memoryMoves;
    document.getElementById('memory-pairs').textContent = memoryMatches;
    
    createMemoryGrid();
    
    document.getElementById('reset-memory-btn').onclick = initMemoryGame;
};

const createMemoryGrid = () => {
    const grid = document.getElementById('memory-grid');
    grid.innerHTML = '';
    
    memoryCards.forEach((symbol, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.dataset.index = index;
        card.dataset.symbol = symbol;
        card.innerHTML = '<div class="memory-card-back">?</div><div class="memory-card-front">' + symbol + '</div>';
        card.onclick = () => flipMemoryCard(index);
        grid.appendChild(card);
    });
};

const flipMemoryCard = (index) => {
    if (!memoryCanFlip || memoryFlippedCards.includes(index)) return;
    
    const card = document.querySelector(`[data-index="${index}"]`);
    if (card.classList.contains('flipped')) return;
    
    // Add flip animation
    card.style.transform = 'rotateY(90deg)';
    
    setTimeout(() => {
        card.classList.add('flipped');
        card.style.transform = 'rotateY(0deg)';
        memoryFlippedCards.push(index);
        
        if (memoryFlippedCards.length === 2) {
            memoryCanFlip = false;
            memoryMoves++;
            document.getElementById('memory-moves').textContent = memoryMoves;
            
            const [first, second] = memoryFlippedCards;
            const card1 = document.querySelector(`[data-index="${first}"]`);
            const card2 = document.querySelector(`[data-index="${second}"]`);
            
            if (card1.dataset.symbol === card2.dataset.symbol) {
                memoryMatches++;
                document.getElementById('memory-pairs').textContent = memoryMatches;
                
                // Match found - add success animation
                card1.classList.add('matched');
                card2.classList.add('matched');
                
                setTimeout(() => {
                    memoryFlippedCards = [];
                    memoryCanFlip = true;
                    
                    if (memoryMatches === 8) {
                        saveActivity(`🧠 Completed Memory Match in ${memoryMoves} moves!`, 'fa-trophy');
                        setTimeout(() => {
                            showConfetti();
                            setTimeout(() => {
                                alert(`🎉 Congratulations! You completed the game in ${memoryMoves} moves!`);
                                closeGame('memory-modal');
                            }, 1500);
                        }, 500);
                    }
                }, 500);
            } else {
                // No match - flip back with delay
                setTimeout(() => {
                    card1.style.transform = 'rotateY(90deg)';
                    card2.style.transform = 'rotateY(90deg)';
                    
                    setTimeout(() => {
                        card1.classList.remove('flipped');
                        card2.classList.remove('flipped');
                        card1.style.transform = 'rotateY(0deg)';
                        card2.style.transform = 'rotateY(0deg)';
                        memoryFlippedCards = [];
                        memoryCanFlip = true;
                    }, 300);
                }, 1500);
            }
        }
    }, 150);
};

// Rock Paper Scissors Game
let rpsPlayerScore = 0;
let rpsComputerScore = 0;

const playRockPaperScissors = () => {
    incrementGameCount();
    saveActivity('✂️ Started playing Rock Paper Scissors!', 'fa-hand-rock');
    
    const modal = document.getElementById('rps-modal');
    modal.style.display = 'flex';
    initRockPaperScissors();
};

const initRockPaperScissors = () => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        const scoresKey = `rps_scores_${currentUser.email}`;
        const scores = JSON.parse(localStorage.getItem(scoresKey)) || { player: 0, computer: 0 };
        rpsPlayerScore = scores.player || 0;
        rpsComputerScore = scores.computer || 0;
    }
    
    document.getElementById('rps-player-score').textContent = rpsPlayerScore;
    document.getElementById('rps-computer-score').textContent = rpsComputerScore;
    document.getElementById('rps-player-choice').textContent = '?';
    document.getElementById('rps-computer-choice').textContent = '?';
    document.getElementById('rps-winner').textContent = 'Choose your weapon!';
    
    document.querySelectorAll('.rps-choice').forEach(choice => {
        choice.onclick = () => playRPSRound(choice.dataset.choice);
    });
    
    document.getElementById('reset-rps-btn').onclick = () => {
        rpsPlayerScore = 0;
        rpsComputerScore = 0;
        document.getElementById('rps-player-score').textContent = 0;
        document.getElementById('rps-computer-score').textContent = 0;
        saveScore('rps', rpsPlayerScore, rpsComputerScore);
    };
};

const playRPSRound = (playerChoice) => {
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];
    
    const emojis = { rock: '🪨', paper: '📄', scissors: '✂️' };
    
    // Animate choices
    const playerDisplay = document.getElementById('rps-player-choice');
    const computerDisplay = document.getElementById('rps-computer-choice');
    const winnerDisplay = document.getElementById('rps-winner');
    
    // Reset and animate
    playerDisplay.textContent = '?';
    computerDisplay.textContent = '?';
    winnerDisplay.textContent = 'Get ready...';
    
    playerDisplay.style.animation = 'pulse 0.5s ease';
    computerDisplay.style.animation = 'pulse 0.5s ease';
    
    setTimeout(() => {
        playerDisplay.textContent = emojis[playerChoice];
        playerDisplay.style.animation = 'choiceReveal 0.5s ease';
    }, 500);
    
    setTimeout(() => {
        computerDisplay.textContent = emojis[computerChoice];
        computerDisplay.style.animation = 'choiceReveal 0.5s ease';
    }, 1000);
    
    setTimeout(() => {
        let result = '';
        if (playerChoice === computerChoice) {
            result = "It's a Tie!";
            winnerDisplay.style.color = '#FFD93D';
        } else if (
            (playerChoice === 'rock' && computerChoice === 'scissors') ||
            (playerChoice === 'paper' && computerChoice === 'rock') ||
            (playerChoice === 'scissors' && computerChoice === 'paper')
        ) {
            result = '🎉 You Win!';
            rpsPlayerScore++;
            document.getElementById('rps-player-score').textContent = rpsPlayerScore;
            winnerDisplay.style.color = '#51cf66';
            playerDisplay.style.animation = 'bounce 0.6s ease';
        } else {
            result = '🤖 Computer Wins!';
            rpsComputerScore++;
            document.getElementById('rps-computer-score').textContent = rpsComputerScore;
            winnerDisplay.style.color = '#ff6b6b';
            computerDisplay.style.animation = 'bounce 0.6s ease';
        }
        
        winnerDisplay.textContent = result;
        winnerDisplay.style.animation = 'fadeIn 0.5s ease';
        saveScore('rps', rpsPlayerScore, rpsComputerScore);
    }, 1500);
};

// Quiz Game
let quizQuestions = [
    {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correct: 2
    },
    {
        question: "How many continents are there?",
        options: ["5", "6", "7", "8"],
        correct: 2
    },
    {
        question: "What is 15 × 3?",
        options: ["35", "40", "45", "50"],
        correct: 2
    },
    {
        question: "What is the largest planet in our solar system?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        correct: 2
    },
    {
        question: "What year did World War II end?",
        options: ["1943", "1944", "1945", "1946"],
        correct: 2
    },
    {
        question: "Which ocean is the largest?",
        options: ["Atlantic", "Indian", "Arctic", "Pacific"],
        correct: 3
    },
    {
        question: "How many legs does a spider have?",
        options: ["6", "8", "10", "12"],
        correct: 1
    },
    {
        question: "What is the fastest land animal?",
        options: ["Lion", "Cheetah", "Tiger", "Leopard"],
        correct: 1
    },
    {
        question: "What is the chemical symbol for gold?",
        options: ["Go", "Gd", "Au", "Ag"],
        correct: 2
    },
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Mercury"],
        correct: 1
    }
];

let quizCurrentQuestion = 0;
let quizScore = 0;
let quizAnswered = false;
let currentQuizQuestions = [];

const playQuizGame = () => {
    incrementGameCount();
    saveActivity('❓ Started playing Trivia Quiz!', 'fa-question-circle');
    
    const modal = document.getElementById('quiz-modal');
    modal.style.display = 'flex';
    initQuizGame();
};

const initQuizGame = () => {
    quizCurrentQuestion = 0;
    quizScore = 0;
    quizAnswered = false;
    
    // Shuffle questions for variety - use a copy
    const allQuestions = [
        {
            question: "What is the capital of France?",
            options: ["London", "Berlin", "Paris", "Madrid"],
            correct: 2
        },
        {
            question: "How many continents are there?",
            options: ["5", "6", "7", "8"],
            correct: 2
        },
        {
            question: "What is 15 × 3?",
            options: ["35", "40", "45", "50"],
            correct: 2
        },
        {
            question: "What is the largest planet in our solar system?",
            options: ["Earth", "Mars", "Jupiter", "Saturn"],
            correct: 2
        },
        {
            question: "What year did World War II end?",
            options: ["1943", "1944", "1945", "1946"],
            correct: 2
        },
        {
            question: "Which ocean is the largest?",
            options: ["Atlantic", "Indian", "Arctic", "Pacific"],
            correct: 3
        },
        {
            question: "How many legs does a spider have?",
            options: ["6", "8", "10", "12"],
            correct: 1
        },
        {
            question: "What is the fastest land animal?",
            options: ["Lion", "Cheetah", "Tiger", "Leopard"],
            correct: 1
        },
        {
            question: "What is the chemical symbol for gold?",
            options: ["Go", "Gd", "Au", "Ag"],
            correct: 2
        },
        {
            question: "Which planet is known as the Red Planet?",
            options: ["Venus", "Mars", "Jupiter", "Mercury"],
            correct: 1
        }
    ];
    
    const shuffledQuestions = [...allQuestions].sort(() => Math.random() - 0.5);
    currentQuizQuestions = shuffledQuestions.slice(0, 5); // Use 5 random questions
    
    document.getElementById('quiz-total').textContent = currentQuizQuestions.length;
    showQuizQuestion();
    
    document.getElementById('next-quiz-btn').onclick = () => {
        if (quizCurrentQuestion < currentQuizQuestions.length - 1) {
            quizCurrentQuestion++;
            quizAnswered = false;
            showQuizQuestion();
        } else {
            // Quiz complete
            const percentage = Math.round((quizScore / currentQuizQuestions.length) * 100);
            document.getElementById('quiz-question').textContent = `🎉 Quiz Complete!`;
            document.getElementById('quiz-options').innerHTML = `<div class="quiz-final-score">You scored ${quizScore}/${currentQuizQuestions.length} (${percentage}%)!</div>`;
            document.getElementById('quiz-result').textContent = '';
            document.getElementById('next-quiz-btn').style.display = 'none';
            
            if (percentage === 100) {
                showConfetti();
            }
            
            saveActivity(`❓ Quiz completed: ${quizScore}/${currentQuizQuestions.length} correct!`, 'fa-trophy');
            
            setTimeout(() => {
                closeGame('quiz-modal');
            }, 3000);
        }
    };
};

const showQuizQuestion = () => {
    const question = currentQuizQuestions[quizCurrentQuestion];
    document.getElementById('quiz-current').textContent = quizCurrentQuestion + 1;
    document.getElementById('quiz-total').textContent = currentQuizQuestions.length;
    document.getElementById('quiz-total-score').textContent = currentQuizQuestions.length;
    document.getElementById('quiz-score').textContent = quizScore;
    document.getElementById('quiz-question').textContent = question.question;
    document.getElementById('quiz-result').textContent = '';
    document.getElementById('next-quiz-btn').style.display = 'none';
    
    const optionsDiv = document.getElementById('quiz-options');
    optionsDiv.innerHTML = '';
    
    question.options.forEach((option, index) => {
        const optionBtn = document.createElement('div');
        optionBtn.className = 'quiz-option';
        optionBtn.textContent = option;
        optionBtn.onclick = () => selectQuizAnswer(index);
        optionsDiv.appendChild(optionBtn);
    });
};

const selectQuizAnswer = (selectedIndex) => {
    if (quizAnswered) return;
    
    quizAnswered = true;
    const question = currentQuizQuestions[quizCurrentQuestion];
    const options = document.querySelectorAll('.quiz-option');
    const resultDiv = document.getElementById('quiz-result');
    
    // Add click animation
    const selectedOption = options[selectedIndex];
    selectedOption.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
        options.forEach((option, index) => {
            option.style.pointerEvents = 'none';
            option.style.transition = 'all 0.3s ease';
            
            if (index === question.correct) {
                setTimeout(() => {
                    option.classList.add('correct');
                    option.style.animation = 'correctPulse 0.5s ease';
                }, 200);
            } else if (index === selectedIndex && index !== question.correct) {
                setTimeout(() => {
                    option.classList.add('wrong');
                    option.style.animation = 'shake 0.5s ease';
                }, 200);
            }
        });
        
        if (selectedIndex === question.correct) {
            quizScore++;
            document.getElementById('quiz-score').textContent = quizScore;
            resultDiv.textContent = '✅ Correct!';
            resultDiv.style.color = '#51cf66';
            resultDiv.style.animation = 'fadeIn 0.5s ease';
        } else {
            resultDiv.textContent = `❌ Wrong! Correct answer: ${question.options[question.correct]}`;
            resultDiv.style.color = '#ff6b6b';
            resultDiv.style.animation = 'fadeIn 0.5s ease';
        }
        
        if (quizCurrentQuestion < quizQuestions.length - 1) {
            document.getElementById('next-quiz-btn').style.display = 'block';
            document.getElementById('next-quiz-btn').style.animation = 'slideUp 0.5s ease';
        } else {
            document.getElementById('next-quiz-btn').textContent = 'See Results';
            document.getElementById('next-quiz-btn').style.display = 'block';
            document.getElementById('next-quiz-btn').style.animation = 'slideUp 0.5s ease';
        }
    }, 100);
};

// Game History
const showGameHistory = () => {
    const modal = document.getElementById('history-modal');
    modal.style.display = 'flex';
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const userEmail = currentUser.email;
    const userStatsKey = `userStats_${userEmail}`;
    const stats = JSON.parse(localStorage.getItem(userStatsKey)) || {};
    
    const historyStats = document.getElementById('history-stats');
    historyStats.innerHTML = `
        <div class="history-stat-card">
            <h3>📊 Overall Stats</h3>
            <p>Games Played: <strong>${stats.games || 0}</strong></p>
            <p>Achievements: <strong>${stats.achievements || 0}</strong></p>
            <p>Day Streak: <strong>${stats.streak || 1}</strong></p>
        </div>
        <div class="history-stat-card">
            <h3>🎮 Game Scores</h3>
            <p>Tic-Tac-Toe Wins: <strong>${getGameScore('tictactoe', 'player') || 0}</strong></p>
            <p>Rock Paper Scissors Wins: <strong>${getGameScore('rps', 'player') || 0}</strong></p>
        </div>
    `;
    
    const historyList = document.getElementById('history-list');
    const activitiesKey = `activities_${userEmail}`;
    const activities = JSON.parse(localStorage.getItem(activitiesKey)) || [];
    
    historyList.innerHTML = '<h3>📜 Recent Game Activities</h3>';
    if (activities.length === 0) {
        historyList.innerHTML += '<p>No game activities yet. Start playing games!</p>';
    } else {
        activities.slice(0, 10).forEach(activity => {
            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <i class="fas ${activity.icon || 'fa-info-circle'}"></i>
                <div>
                    <p><strong>${activity.message}</strong></p>
                    <span>${activity.time}</span>
                </div>
            `;
            historyList.appendChild(item);
        });
    }
};

const saveScore = (gameType, playerScore, computerScore) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    const scoresKey = `${gameType}_scores_${currentUser.email}`;
    localStorage.setItem(scoresKey, JSON.stringify({ player: playerScore, computer: computerScore }));
};

const getGameScore = (gameType, type) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return 0;
    
    const scoresKey = `${gameType}_scores_${currentUser.email}`;
    const scores = JSON.parse(localStorage.getItem(scoresKey)) || {};
    return scores[type] || 0;
};

// Close modal when clicking outside
window.onclick = (event) => {
    const modals = document.querySelectorAll('.game-modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
};

// Hamburger menu functionality
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger-menu');
    const navbar = document.querySelector('.navbar');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navbar.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link-fun');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('active');
        });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (!navbar.contains(event.target) && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
        }
    });

    // Check if user is already logged in on page load
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        const userData = localStorage.getItem(user.email);
        if (userData) {
            const userInfo = JSON.parse(userData);
            showLandingPage(userInfo.username);
        }
    }
});
