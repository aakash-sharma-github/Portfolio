import bcrypt from 'bcryptjs';

/**
 * Generate a hash for the given password
 * @param {string} password - The password to hash
 * @returns {Promise<string>} - The hashed password
 */
async function generateHash(password) {
    try {
        // Generate salt with cost factor of 12 (recommended for production)
        const saltRounds = 12;
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw new Error(`Error generating hash: ${error.message}`);
    }
}

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - The plain text password
 * @param {string} hash - The hashed password to compare against
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 */
async function comparePassword(password, hash) {
    try {
        const isMatch = await bcrypt.compare(password, hash);
        return isMatch;
    } catch (error) {
        throw new Error(`Error comparing password: ${error.message}`);
    }
}

export { generateHash, comparePassword };
