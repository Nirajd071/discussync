#!/bin/bash

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Installing backend requirements...${NC}"

# Check if virtual environment exists
if [ ! -d "venv" ]; then
  echo -e "${YELLOW}Creating virtual environment...${NC}"
  python3 -m venv venv
fi

# Activate virtual environment
echo -e "${BLUE}Activating virtual environment...${NC}"
source venv/bin/activate

# Install required packages
echo -e "${YELLOW}Installing required packages...${NC}"
pip install fastapi python-jose python-dotenv pydantic[email] uvicorn python-multipart bcrypt sqlalchemy

# Create symlink to app directory
echo -e "${BLUE}Creating symlink to app directory...${NC}"
cd backend/fastapi_app
if [ ! -L "app_link" ]; then
  ln -sf app app_link
fi

# Set PYTHONPATH to include current directory
export PYTHONPATH=$PYTHONPATH:$(pwd)

echo -e "${GREEN}Backend requirements installed successfully!${NC}"
echo -e "${BLUE}You can now run the backend with: ./start_servers.sh${NC}"

# Go back to the root directory
cd ../..
