#!/bin/bash

# TruthQuest Development Startup Script

echo "🚀 Starting TruthQuest Development Environment..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Function to install dependencies if needed
install_deps() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir/node_modules" ]; then
        echo "📦 Installing $name dependencies..."
        cd "$dir"
        npm install
        cd ..
    else
        echo "✅ $name dependencies already installed"
    fi
}

# Install frontend dependencies
install_deps "." "Frontend"

# Install backend dependencies
install_deps "backend" "Backend"

echo ""
echo "🎮 Starting TruthQuest servers..."
echo ""

# Start backend server in background
echo "🔧 Starting Backend API Server..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🌐 Starting Frontend Development Server..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ TruthQuest is starting up!"
echo ""
echo "📊 Backend API: http://localhost:3001"
echo "🌐 Frontend App: http://localhost:3000"
echo "🔍 Health Check: http://localhost:3001/health"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down TruthQuest servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait