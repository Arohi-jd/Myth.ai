#!/usr/bin/env node

/**
 * Test script to verify authentication flow
 * Run with: node test-auth.js
 */

const API_BASE = 'http://localhost:5002/api';

async function testAuth() {
  console.log('🧪 Testing Authentication Flow\n');

  // Test 1: Login
  console.log('1️⃣  Testing Login...');
  try {
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com', // Change to your test email
        password: 'testpassword123' // Change to your test password
      })
    });

    const loginData = await loginResponse.json();
    
    if (!loginResponse.ok) {
      console.log('❌ Login failed:', loginData.message);
      console.log('   Create a test account first with signup\n');
      return;
    }

    const token = loginData.session?.access_token;
    if (!token) {
      console.log('❌ No access token in response');
      console.log('   Response:', JSON.stringify(loginData, null, 2));
      return;
    }

    console.log('✅ Login successful');
    console.log('   Token:', token.substring(0, 30) + '...\n');

    // Test 2: Verify token
    console.log('2️⃣  Testing Token Verification...');
    const verifyResponse = await fetch(`${API_BASE}/auth/verify`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const verifyData = await verifyResponse.json();
    
    if (!verifyResponse.ok) {
      console.log('❌ Token verification failed:', verifyData.message);
      console.log('   Details:', JSON.stringify(verifyData, null, 2));
      return;
    }

    console.log('✅ Token verified successfully');
    console.log('   User:', verifyData.user.email, '\n');

    // Test 3: Protected endpoint (/me)
    console.log('3️⃣  Testing Protected Endpoint (/api/auth/me)...');
    const meResponse = await fetch(`${API_BASE}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const meData = await meResponse.json();
    
    if (!meResponse.ok) {
      console.log('❌ /me endpoint failed:', meData.message);
      return;
    }

    console.log('✅ /me endpoint successful');
    console.log('   User:', meData.user.email);
    console.log('   Profile:', meData.profile ? 'Found' : 'Not found', '\n');

    // Test 4: Chat endpoint
    console.log('4️⃣  Testing Chat Endpoint...');
    const chatResponse = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ message: 'Hello' })
    });

    const chatData = await chatResponse.json();
    
    if (!chatResponse.ok) {
      console.log('❌ Chat endpoint failed:', chatData.message);
      return;
    }

    console.log('✅ Chat endpoint successful');
    console.log('   Reply:', chatData.reply.substring(0, 100) + '...\n');

    console.log('🎉 All tests passed! Authentication is working correctly.\n');

  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
}

testAuth();
