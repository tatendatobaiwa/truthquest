# TruthQuest - Fight Fake News, Win Real Knowledge

A web-based, Kahoot-style interactive quiz game designed to strengthen youth Media and Information Literacy (MIL). Players compete in real-time by answering questions that test their ability to detect misinformation, evaluate sources, and fact-check content.

## 🚀 Features

- **Real-time multiplayer quiz battles** (Kahoot-style gameplay)
- **Host game lobbies** with customizable settings
- **Join public games** or enter private game codes
- **Solo play mode** with different categories
- **Live leaderboards** and player statistics
- **User profiles** with achievements and customization
- **Fact-check integration** with educational explanations
- **Mobile-responsive design** with bold, energetic UI

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Material Icons
- **Fonts**: Anton (headings), Inter (body text)
- **State Management**: React hooks (Zustand ready for complex state)
- **Real-time**: Socket.IO ready (placeholder implementation)

## 📦 Installation & Setup

### Quick Start (Recommended)

1. **Make the startup script executable**:
   ```bash
   chmod +x start-dev.sh
   ```

2. **Start the full application**:
   ```bash
   ./start-dev.sh
   ```

This will automatically:
- Install all dependencies for both frontend and backend
- Start the backend API server on port 3001
- Start the frontend development server on port 3000
- Display all relevant URLs and information

### Manual Setup

If you prefer to start services individually:

1. **Install frontend dependencies**:
   ```bash
   npm install
   ```

2. **Install backend dependencies**:
   ```bash
   cd backend
   npm install
   cd ..
   ```

3. **Start the backend server**:
   ```bash
   cd backend
   npm run dev
   ```

4. **In a new terminal, start the frontend**:
   ```bash
   npm run dev
   ```

### Access Points

- **Frontend Application**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **Socket.IO**: ws://localhost:3001

## 🎮 How to Use

### For Players

1. **Join a Game**:
   - Enter a 6-digit game code on the home page
   - Add your battle name
   - Click "JOIN GAME NOW!"

2. **Browse Public Games**:
   - Go to "JOIN GAMES" in the navigation
   - Browse available public games
   - Click "JOIN" on any game with available slots

3. **Play Solo**:
   - Select "PLAY SOLO" on the home page
   - Choose category and number of questions
   - Start your solo battle

### For Hosts

1. **Create a Game**:
   - Click "HOST" in the navigation
   - Configure game settings (question pack, time limits, etc.)
   - Click "CREATE GAME ROOM"

2. **Manage Your Lobby**:
   - Share the generated game code with players
   - Monitor players joining your lobby
   - Adjust settings as needed
   - Start the game when ready

## 🎨 Design System

The application uses a bold, high-energy design system:

- **Colors**: Yellow (#FFD23F), Blue (#64B5F6), Orange (#FF7043), Pink (#EC407A), Green (#90EE90)
- **Typography**: Anton for headings, Inter for body text
- **Borders**: 3px black borders throughout
- **Shadows**: 8px offset shadows for depth
- **Background**: Diagonal stripe pattern on yellow base

## 📱 Pages Overview

- **Home** (`/`): Main landing page with join/host/solo options
- **Host** (`/host`): Game creation and lobby management
- **Join** (`/join`): Browse and join public games
- **Game** (`/game/[gameId]`): Active game interface with questions
- **Leaderboard** (`/leaderboard`): Global and filtered leaderboards
- **Stats** (`/stats`): Personal performance statistics
- **Profile** (`/profile`): User customization and achievements

## 🔧 Development Status

### ✅ Completed
- Project setup and configuration
- Complete design system implementation
- All main page layouts and components
- Navigation and routing
- Responsive design
- TypeScript type definitions

### 🚧 In Progress / Next Steps
- Backend API implementation
- Socket.IO real-time functionality
- Database integration
- Question bank management
- User authentication
- Game state management
- Achievement system logic

### 📋 TODO
- Real-time multiplayer functionality
- Question database with fact-check sources
- User registration and profiles
- Game analytics and reporting
- Mobile app optimization
- Deployment configuration

## 🎯 Game Flow

1. **Lobby Phase**: Players join and wait for host to start
2. **Question Phase**: Display question with 4 multiple-choice answers
3. **Answer Phase**: Players select answers within time limit
4. **Results Phase**: Show correct answer, explanation, and fact-check source
5. **Leaderboard Update**: Display current scores
6. **Repeat**: Continue for configured number of questions
7. **Final Results**: Show final rankings and statistics

## 🌍 Educational Mission

TruthQuest aims to strengthen Media and Information Literacy by:

- Teaching critical evaluation of information sources
- Providing fact-check references from reputable organizations
- Gamifying the learning process to increase engagement
- Building habits of verification and source checking
- Addressing common misinformation topics relevant to youth

## 🤝 Contributing

This project is designed for educational purposes and hackathon development. Key areas for contribution:

- Question bank development with verified fact-checks
- Real-time multiplayer implementation
- Mobile optimization
- Accessibility improvements
- Localization for different regions

## 📄 License

This project is developed for educational and non-commercial use, focusing on media literacy education and misinformation awareness.

---

**Built with ❤️ for digital literacy education**