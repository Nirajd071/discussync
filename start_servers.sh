#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting DiscuSync Servers...${NC}"

# Kill any existing processes on the ports we need
echo -e "${BLUE}Checking for existing processes on ports 8004 and 5174...${NC}"
lsof -ti:8004 | xargs kill -9 2>/dev/null
lsof -ti:5174 | xargs kill -9 2>/dev/null

# Start the backend server
echo -e "${YELLOW}Starting backend server on port 8004...${NC}"
cd backend/fastapi_app
source venv/bin/activate
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8004 &
BACKEND_PID=$!
echo -e "${GREEN}Backend server started with PID: $BACKEND_PID${NC}"

# Wait for backend to be ready
echo -e "${BLUE}Waiting for backend server to be ready...${NC}"
MAX_RETRIES=30
RETRY_COUNT=0
while ! curl -s http://localhost:8004/ > /dev/null; do
  RETRY_COUNT=$((RETRY_COUNT+1))
  if [ $RETRY_COUNT -ge $MAX_RETRIES ]; then
    echo -e "${RED}Backend server failed to start after $MAX_RETRIES attempts${NC}"
    kill $BACKEND_PID 2>/dev/null
    exit 1
  fi
  echo -e "${YELLOW}Waiting for backend server (attempt $RETRY_COUNT/$MAX_RETRIES)...${NC}"
  sleep 1
done

echo -e "${GREEN}Backend server is ready!${NC}"

# Go back to the root directory
cd ../..

# Start the frontend server
echo -e "${YELLOW}Starting frontend server on port 5174...${NC}"
cd frontend
npm run dev &
FRONTEND_PID=$!
echo -e "${GREEN}Frontend server started with PID: $FRONTEND_PID${NC}"

# Go back to the root directory
cd ..

echo -e "${GREEN}Both servers are now running!${NC}"
echo -e "${BLUE}Backend: http://localhost:8004${NC}"
echo -e "${BLUE}Frontend: http://localhost:5174${NC}"
echo -e "${BLUE}Admin Login: http://localhost:5174/admin/login${NC}"
echo -e "${BLUE}Admin Credentials: admin@discussync.com / admin123${NC}"
echo -e "${YELLOW}Press Ctrl+C to stop both servers${NC}"

# Function to handle script termination
function cleanup {
  echo -e "${YELLOW}Stopping servers...${NC}"
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  echo -e "${GREEN}Servers stopped.${NC}"
  exit 0
}

# Register the cleanup function for when the script is terminated
trap cleanup SIGINT SIGTERM

# Wait for user to press Ctrl+C
wait
