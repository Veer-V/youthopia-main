/**
 * API Testing Script
 * Run this to test all API endpoints
 */

import API from './services/apiService';

// Test data
const testUser = {
    name: "Test User",
    institute: "Test University",
    mobile: 9999999999,
    class: "12th",
    stream: "Science",
    gender: "Male",
    age: 18,
    password: "testpass123"
};

const testEvent = {
    name: "Test Event",
    description: "A test event",
    location: "Test Location",
    participant_count: 50,
    completed: 0,
    points: 100,
    prizes: {
        first: "Gold Medal",
        second: "Silver Medal"
    },
    schedule: {
        start: new Date().toISOString(),
        end: new Date(Date.now() + 86400000).toISOString()
    },
    images: "test-image.jpg"
};

async function testAPIs() {
    console.log('🧪 Starting API Tests...\n');

    // Test 1: User Registration
    console.log('1️⃣ Testing User Registration...');
    try {
        const registerResult = await API.registerUser(testUser);
        if (registerResult.error) {
            console.log('❌ Registration failed:', registerResult.error);
        } else {
            console.log('✅ Registration successful:', registerResult.data);
        }
    } catch (error: any) {
        console.log('❌ Registration error:', error.message);
    }

    // Test 2: User Login
    console.log('\n2️⃣ Testing User Login...');
    try {
        const loginResult = await API.loginUser({
            mobile: testUser.mobile,
            password: testUser.password
        });
        if (loginResult.error) {
            console.log('❌ Login failed:', loginResult.error);
        } else {
            console.log('✅ Login successful:', loginResult.data);
        }
    } catch (error: any) {
        console.log('❌ Login error:', error.message);
    }

    // Test 3: Get All Events
    console.log('\n3️⃣ Testing Get All Events...');
    try {
        const eventsResult = await API.getAllEvents();
        if (eventsResult.error) {
            console.log('❌ Get events failed:', eventsResult.error);
        } else {
            console.log(`✅ Retrieved ${eventsResult.data?.length || 0} events`);
            if (eventsResult.data && eventsResult.data.length > 0) {
                console.log('   First event:', eventsResult.data[0].name);
            }
        }
    } catch (error: any) {
        console.log('❌ Get events error:', error.message);
    }

    // Test 4: Get User Data
    console.log('\n4️⃣ Testing Get User Data...');
    try {
        const userDataResult = await API.getUserData('161C03');
        if (userDataResult.error) {
            console.log('❌ Get user data failed:', userDataResult.error);
        } else {
            console.log('✅ User data retrieved:', userDataResult.data?.name);
        }
    } catch (error: any) {
        console.log('❌ Get user data error:', error.message);
    }

    // Test 5: Get User Points
    console.log('\n5️⃣ Testing Get User Points...');
    try {
        const pointsResult = await API.getUserPoints('161C03');
        if (pointsResult.error) {
            console.log('❌ Get user points failed:', pointsResult.error);
        } else {
            console.log('✅ User points retrieved:', pointsResult.data);
        }
    } catch (error: any) {
        console.log('❌ Get user points error:', error.message);
    }

    // Test 6: Get All Transactions
    console.log('\n6️⃣ Testing Get All Transactions...');
    try {
        const transactionsResult = await API.getAllTransactions();
        if (transactionsResult.error) {
            console.log('❌ Get transactions failed:', transactionsResult.error);
        } else {
            console.log(`✅ Retrieved ${transactionsResult.data?.length || 0} transactions`);
        }
    } catch (error: any) {
        console.log('❌ Get transactions error:', error.message);
    }

    // Test 7: Get All Redemptions
    console.log('\n7️⃣ Testing Get All Redemptions...');
    try {
        const redemptionsResult = await API.getAllRedemptions();
        if (redemptionsResult.error) {
            console.log('❌ Get redemptions failed:', redemptionsResult.error);
        } else {
            console.log(`✅ Retrieved ${redemptionsResult.data?.length || 0} redemptions`);
        }
    } catch (error: any) {
        console.log('❌ Get redemptions error:', error.message);
    }

    // Test 8: Get Leaderboard
    console.log('\n8️⃣ Testing Get Leaderboard...');
    try {
        const leaderboardResult = await API.getAllLeaderboard();
        if (leaderboardResult.error) {
            console.log('❌ Get leaderboard failed:', leaderboardResult.error);
        } else {
            console.log(`✅ Retrieved ${leaderboardResult.data?.length || 0} leaderboard entries`);
            if (leaderboardResult.data && leaderboardResult.data.length > 0) {
                console.log('   Top entry:', leaderboardResult.data[0].name, '-', leaderboardResult.data[0].points, 'points');
            }
        }
    } catch (error: any) {
        console.log('❌ Get leaderboard error:', error.message);
    }

    // Test 9: Create Event (may require admin access)
    console.log('\n9️⃣ Testing Create Event...');
    try {
        const createEventResult = await API.createEvent(testEvent);
        if (createEventResult.error) {
            console.log('⚠️  Create event failed (may require admin):', createEventResult.error);
        } else {
            console.log('✅ Event created:', createEventResult.data);
        }
    } catch (error: any) {
        console.log('⚠️  Create event error:', error.message);
    }

    console.log('\n✅ API Testing Complete!\n');
}

// Run tests
testAPIs().catch(console.error);
