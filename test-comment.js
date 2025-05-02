// This is a simple test script to verify our fixes
const fetch = require('node-fetch');

async function testCommentCreation() {
  try {
    // Replace with your actual auth token
    const authToken = 'your_auth_token';
    const discussionId = 'your_discussion_id';
    
    const url = `http://localhost:8004/api/discussions/${discussionId}/comments/`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    };
    
    const data = {
      content: 'This is a test comment'
    };
    
    console.log('Sending request to:', url);
    console.log('With headers:', headers);
    console.log('And data:', data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('Comment created successfully:', result);
    } else {
      const errorText = await response.text();
      console.error('Error creating comment:', errorText);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run the test
// testCommentCreation();

async function testFileUpload() {
  try {
    // Replace with your actual auth token
    const authToken = 'your_auth_token';
    
    const url = `http://localhost:8004/api/files/upload/`;
    const headers = {
      'Authorization': `Bearer ${authToken}`
    };
    
    // In a real test, you would use FormData and append a file
    // This is just a placeholder
    console.log('File upload test would send request to:', url);
    console.log('With headers:', headers);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Uncomment to run the test
// testFileUpload();

console.log('Test script loaded successfully. Uncomment the test functions to run them.');
