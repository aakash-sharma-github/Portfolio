import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
<<<<<<< HEAD
            dbName: 'portfolioDB',
            // Security: set connection timeout
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 10000,
=======
            dbName: 'portfolioDB'
>>>>>>> f0bd05686884520ae2295270458b86f898ad84cd
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
            console.log('Connected to MongoDB database.');
            return mongooseInstance;
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (error) {
        // FIX: reset promise so the next call can retry the connection
        cached.promise = null;
        // FIX: throw the error instead of returning a NextResponse (lib files must not import from next/server)
        throw new Error(`Failed to connect to database: ${error.message}`);
    }

    return cached.conn;
}

export default connectToDatabase;