import mongoose from 'mongoose';

// Define the Blog schema
const BlogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, 'Title cannot be more than 100 characters']
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            trim: true,
            lowercase: true
        },
        excerpt: {
            type: String,
            required: [true, 'Excerpt is required'],
            maxlength: [300, 'Excerpt cannot be more than 300 characters']
        },
        content: {
            type: String,
            required: [true, 'Content is required']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true
        },
        coverImage: {
            url: {
                type: String,
                required: [true, 'Cover image URL is required']
            },
            publicId: {
                type: String,
                required: [true, 'Cover image public ID is required']
            }
        },
        readTime: {
            type: String,
            default: '5 min read'
        },
        published: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true, // Adds createdAt and updatedAt fields
        collection: 'blogs' // Explicitly specify the collection name
    }
);

// Create and export the Blog model
// Use mongoose.models to prevent model recompilation error in development
export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema); 