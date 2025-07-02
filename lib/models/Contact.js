import mongoose from 'mongoose';

// Define the Contact schema
const ContactSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            maxlength: [30, 'Name cannot be more than 30 characters']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
            maxlength: [200, 'Subject cannot be more than 200 characters']
        },
        message: {
            type: String,
            required: [true, 'Message is required'],
            trim: true,
            maxlength: [2000, 'Message cannot be more than 2000 characters']
        },
        status: {
            type: String,
            enum: ['unread', 'read'],
            default: 'unread'
        },
    },
    {
        timestamps: true,
        collection: 'contacts'
    }
);

// Create and export the Contact model
export default mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
