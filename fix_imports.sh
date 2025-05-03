#!/bin/bash

# Activate the virtual environment
source venv/bin/activate

# Create a symlink to the app directory for the scripts in the root directory
cd backend/fastapi_app
ln -sf app app_link

# Update PYTHONPATH to include the current directory
export PYTHONPATH=$PYTHONPATH:$(pwd)

echo "Fixed imports by creating symlinks and updating PYTHONPATH"
echo "Now you can run the backend with: source venv/bin/activate && cd backend/fastapi_app && uvicorn app.main:app --reload"
