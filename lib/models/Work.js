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
            enum: ['Web Application', 'Mobile App', 'Desktop App', 'API', 'Website', 'E-commerce', 'Other'],
            default: 'Web Application'
        },
        stack: [{
            name: {
                type: String,
                required: [true, 'Stack name is required']
            }
        }],
        live: {
            type: String,
            default: ''
        },
        github: {
            type: String,
            default: ''
        },
        images: [{
            url: {
                type: String,
                required: true
            },
            publicId: {
                type: String,
                required: true
            },
            caption: {
                type: String,
                default: ''
            }
        }],
    },
    {
        timestamps: true,
        collection: 'works'
    }
);


// Create and export the Work model
export default mongoose.models.Work || mongoose.model('Work', WorkSchema);
