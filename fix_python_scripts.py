#!/usr/bin/env python3
"""
Script to fix import issues in Python scripts
"""
import os
import sys
import re

def fix_imports_in_file(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Fix imports for app modules
    content = re.sub(r'from app import', r'from backend.fastapi_app.app import', content)
    content = re.sub(r'from app\.', r'from backend.fastapi_app.app.', content)
    content = re.sub(r'import app\.', r'import backend.fastapi_app.app.', content)
    
    # Write the fixed content back to the file
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"Fixed imports in {file_path}")

def main():
    # Fix imports in Python scripts in the root directory
    root_scripts = [
        'fix_sqlite.py',
        'reset_database.py',
        'create_sample_comments.py',
        'list_discussions.py'
    ]
    
    for script in root_scripts:
        if os.path.exists(script):
            fix_imports_in_file(script)
    
    # Fix imports in Python scripts in the backend/fastapi_app directory
    backend_scripts = [
        'create_admin.py',
        'create_discussion.py',
        'create_sample_comments.py',
        'create_sample_content.py',
        'create_sample_discussions.py',
        'create_sample_projects.py',
        'create_test_data.py',
        'create_test_user.py',
        'fix_comments.py',
        'fix_sqlite.py',
        'list_comments.py',
        'list_discussions.py',
        'reset_database.py',
        'reset_users.py',
        'test_comments_api.py',
        'test_reply.py'
    ]
    
    for script in backend_scripts:
        script_path = os.path.join('backend', 'fastapi_app', script)
        if os.path.exists(script_path):
            fix_imports_in_file(script_path)

if __name__ == "__main__":
    main()
