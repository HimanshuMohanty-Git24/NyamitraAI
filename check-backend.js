const axios = require('axios');

async function checkBackend() {
    try {
        console.log('Checking backend server...');
        const response = await axios.get('http://localhost:8081/health');
        console.log('✅ Backend is running!');
        console.log('Response:', response.data);
    } catch (error) {
        console.log('❌ Backend is not running or not accessible');
        console.log('Error:', error.message);
        console.log('\nTo fix this:');
        console.log('1. Open a terminal in your project directory');
        console.log('2. Run: python app.py');
        console.log('3. Make sure you see "Running on http://127.0.0.1:8081"');
    }
}

checkBackend();