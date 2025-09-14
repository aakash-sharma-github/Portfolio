import mongoose from 'mongoose';

// Define the Work/Portfolio schema
const WorkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Project title is required'],
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
        description: {
            type: String,
            required: [true, 'Description is required'],
            maxlength: [500, 'Description cannot be more than 500 characters']
        },
        content: {
            type: String,
            required: [true, 'Content is required']
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Web Development', 'Mobile App', 'Desktop App', 'API Development', 'E-commerce', 'Full Stack Development', 'Other'],
            default: 'Web Development'
        },
        technologies: [{
            name: {
                type: String,
                required: [true, 'Technology name is required']
            }
        }],
        // For backward compatibility
        stack: [{
            name: {
                type: String,
                required: [true, 'Stack name is required']
            }
        }],
        // Cover image for the project
        coverImage: {
            url: {
                type: String,
                required: true,
                default: '/images/portfolio_01.png'
            },
            publicId: {
                type: String,
                default: 'default'
            }
        },
        // Project links
        links: {
            live: {
                type: String,
                default: ''
            },
            github: {
                type: String,
                default: ''
            }
        },
        // Featured flag
        featured: {
            type: Boolean,
            default: false
        },
        // Status
        status: {
            type: String,
            enum: ['completed', 'in-progress', 'archived'],
            default: 'completed'
        },
    },
    {
        timestamps: true,
        collection: 'works'
    }
);


// Clear the cached model to ensure schema updates are applied
if (mongoose.models.Work) {
    delete mongoose.models.Work;
}

// Create and export the Work model
export default mongoose.model('Work', WorkSchema);
