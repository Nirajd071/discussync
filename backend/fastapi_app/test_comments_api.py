"""
Script to test the comments API directly
"""
import requests
import json
import sys
from pprint import pprint

# Get discussion ID from command line or use default
discussion_id = sys.argv[1] if len(sys.argv) > 1 else "ec35f540-56c7-4b8b-8185-bfed1e45939d"

# API base URL
API_BASE_URL = "http://localhost:8005/api"

def test_get_comments(auth_token=None):
    """Test the GET /discussions/{id}/comments/ endpoint"""
    print(f"Testing GET comments for discussion ID: {discussion_id}")

    url = f"{API_BASE_URL}/discussions/{discussion_id}/comments/"
    print(f"Making request to: {url}")

    headers = {}
    if auth_token:
        headers['Authorization'] = f'Bearer {auth_token}'
        print("Using authentication token")

    try:
        response = requests.get(url, headers=headers)

        if response.status_code == 200:
            comments = response.json()
            print(f"Successfully retrieved {len(comments)} comments")

            # Print each comment
            for i, comment in enumerate(comments, 1):
                print(f"\nComment {i}:")
                print(f"  ID: {comment.get('id')}")
                print(f"  Content: {comment.get('content', '')[:50]}...")
                print(f"  Author: {comment.get('author', {}).get('username', 'Unknown')}")
                print(f"  Created: {comment.get('created_at')}")

                # Check for replies
                replies = comment.get('replies', [])
                print(f"  Replies: {len(replies)}")

                # Print each reply
                for j, reply in enumerate(replies, 1):
                    print(f"    Reply {j}:")
                    print(f"      ID: {reply.get('id')}")
                    print(f"      Content: {reply.get('content', '')[:30]}...")
                    print(f"      Author: {reply.get('author', {}).get('username', 'Unknown')}")
                    print(f"      Parent ID: {reply.get('parent_id')}")

            # Save the response to a file for inspection
            with open('comments_response.json', 'w') as f:
                json.dump(comments, f, indent=2)
                print(f"\nSaved full response to comments_response.json")

            return comments
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Exception occurred: {e}")
        return None

def test_create_comment():
    """Test the POST /discussions/{id}/comments/ endpoint"""
    print(f"\nTesting POST comment for discussion ID: {discussion_id}")

    # Get auth token
    auth_token = input("Enter your auth token (from localStorage): ")
    if not auth_token:
        print("No auth token provided, skipping comment creation test")
        return None

    url = f"{API_BASE_URL}/discussions/{discussion_id}/comments/"
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {auth_token}'
    }

    data = {
        'content': 'This is a test comment from the API test script'
    }

    try:
        response = requests.post(url, headers=headers, json=data)

        if response.status_code == 201:
            comment = response.json()
            print(f"Successfully created comment:")
            print(f"  ID: {comment.get('id')}")
            print(f"  Content: {comment.get('content')}")
            return comment
        else:
            print(f"Error: {response.status_code}")
            print(response.text)
            return None
    except Exception as e:
        print(f"Exception occurred: {e}")
        return None

if __name__ == "__main__":
    # Ask for auth token
    auth_token = input("Enter your auth token (from localStorage, press Enter to skip): ")

    # Test getting comments
    comments = test_get_comments(auth_token if auth_token else None)

    # Ask if user wants to create a test comment
    if auth_token and input("\nDo you want to create a test comment? (y/n): ").lower() == 'y':
        test_create_comment()
