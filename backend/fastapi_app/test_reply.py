"""
Script to test the reply functionality
"""
import requests
import json
import sys

# API base URL
API_BASE_URL = "http://localhost:8005/api"

def test_create_reply():
    """Test creating a reply to a comment"""
    # Get auth token
    auth_token = input("Enter your auth token (from localStorage): ")
    if not auth_token:
        print("No auth token provided, cannot test reply functionality")
        return None
    
    # Get discussion ID
    discussion_id = input("Enter discussion ID (press Enter for default 'ec35f540-56c7-4b8b-8185-bfed1e45939d'): ")
    if not discussion_id:
        discussion_id = "ec35f540-56c7-4b8b-8185-bfed1e45939d"
    
    # First, get all comments to find a parent comment
    print(f"Getting comments for discussion ID: {discussion_id}")
    url = f"{API_BASE_URL}/discussions/{discussion_id}/comments/"
    headers = {
        'Authorization': f'Bearer {auth_token}'
    }
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            comments = response.json()
            print(f"Found {len(comments)} comments")
            
            if not comments:
                print("No comments found to reply to")
                return None
            
            # Select the first comment as the parent
            parent_comment = comments[0]
            parent_id = parent_comment['id']
            
            print(f"Selected parent comment: {parent_id}")
            print(f"Parent comment content: {parent_comment['content'][:50]}...")
            
            # Create a reply
            reply_content = "This is a test reply from the API test script"
            reply_data = {
                'content': reply_content,
                'parent_id': parent_id
            }
            
            print(f"Creating reply with data: {reply_data}")
            
            reply_url = f"{API_BASE_URL}/discussions/{discussion_id}/comments/"
            reply_headers = {
                'Content-Type': 'application/json',
                'Authorization': f'Bearer {auth_token}'
            }
            
            reply_response = requests.post(reply_url, headers=reply_headers, json=reply_data)
            
            if reply_response.status_code == 201:
                reply = reply_response.json()
                print(f"Reply created successfully!")
                print(f"Reply ID: {reply.get('id')}")
                print(f"Reply content: {reply.get('content')}")
                print(f"Reply parent ID: {reply.get('parent_id')}")
                return reply
            else:
                print(f"Error creating reply: {reply_response.status_code}")
                print(reply_response.text)
                return None
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Exception occurred: {e}")
        return None

if __name__ == "__main__":
    test_create_reply()
