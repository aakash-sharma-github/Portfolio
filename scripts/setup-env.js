#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function generateJWTSecret() {
    return crypto.randomBytes(32).toString('base64');
}

function createEnvFile() {
    const envPath = path.join(__dirname, '..', '.env.dev');
    
    if (fs.existsSync(envPath)) {
        log('⚠️  .env.dev already exists!', 'yellow');
        const readline = import('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        return new Promise((resolve) => {
            rl.question('Do you want to overwrite it? (y/N): ', (answer) => {
                rl.close();
                if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
                    writeEnvFile(envPath);
                    resolve(true);
                } else {
                    log('❌ Setup cancelled.', 'red');
                    resolve(false);
                }
            });
        });
    } else {
        writeEnvFile(envPath);
        return true;
    }
}

function writeEnvFile(envPath) {
    const jwtSecret = generateJWTSecret();
    
    const envContent = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/portfolio

# JWT Configuration
JWT_SECRET=${jwtSecret}

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
`;

    fs.writeFileSync(envPath, envContent);
    log('✅ Created .env.dev file', 'green');
}

async function main() {
    log('🚀 Portfolio Environment Setup', 'cyan');
    log('================================', 'cyan');
    
    try {
        const created = await createEnvFile();
        
        if (created) {
            log('\n📋 Next Steps:', 'blue');
            log('1. Set your admin password:', 'yellow');
            log('   node scripts/generatePassword.js your_secure_password', 'bright');
            log('2. Copy the generated hash to ADMIN_PASSWORD_HASH in .env.dev', 'yellow');
            log('3. Configure other services (Cloudinary, Email, GitHub) as needed', 'yellow');
            log('4. Start your development server: npm run dev', 'yellow');
            
            log('\n🔒 Security Notes:', 'red');
            log('• Never commit .env.dev to version control', 'red');
            log('• Use strong, unique passwords', 'red');
            log('• Rotate secrets regularly in production', 'red');
            
            log('\n📖 For detailed setup instructions, see ENVIRONMENT_SETUP.md', 'blue');
        }
    } catch (error) {
        log(`❌ Error: ${error.message}`, 'red');
        process.exit(1);
    }
}

main();
