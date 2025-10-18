import { generateHash } from '../controllers/adminController.js';

// Check if password is provided as command line argument
const password = process.argv[2];

if (!password) {
    console.error('Please provide a password as a command line argument');
    console.error('Usage: node scripts/generatePassword.js <your-password>');
    process.exit(1);
}

// Generate and display the hash
generateHash(password)
    .then(hash => {
        const base64 = Buffer.from(hash).toString('base64');
        console.log('\nGenerated Password Hash:');
        console.log('------------------------');
        console.log(`ADMIN_PASSWORD_HASH="${base64}"`);
        console.log('\nAdd this hash to your .env file as ADMIN_PASSWORD_HASH');
        console.log('⚠️  IMPORTANT: Include the double quotes to prevent truncation at special characters!');
        console.log('Make sure to remove or comment out the plain text ADMIN_PASSWORD from your .env file');
    })
    .catch(error => {
        console.error('Error generating hash:', error);
        process.exit(1);
    });
