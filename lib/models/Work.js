import mongoose from 'mongoose';

const WorkSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Project title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        slug: {
            type: String,
            required: [true, 'Slug is required'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        description: {
            type: String,
            required: [true, 'Description is required'],
            trim: true,
            maxlength: [500, 'Description cannot exceed 500 characters'],
        },
        // ✅ content is now optional — removed `required: true`.
        // The frontend no longer shows a content field for works.
        content: {
            type: String,
            default: '',
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            enum: ['Web Development', 'Mobile App', 'Desktop App', 'API Development', 'E-commerce', 'Full Stack Development', 'Other'],
            default: 'Web Development',
        },
        technologies: [{
            name: {
                type: String,
                required: [true, 'Technology name is required'],
            },
        }],
        // Backward-compat alias
        stack: [{
            name: { type: String },
        }],
        // ✅ coverImage.url has a real default so Mongoose never throws
        // "Path `coverImage.url` is required" when no image is provided.
        coverImage: {
            url: {
                type: String,
                default: '/images/portfolio_01.png',
            },
            publicId: {
                type: String,
                default: 'default',
            },
            alt: {
                type: String,
                default: '',
            },
        },
        images: [{
            url: { type: String, required: true },
            publicId: { type: String, default: 'default' },
            caption: { type: String, default: '' },
        }],
        links: {
            live: { type: String, default: '' },
            github: { type: String, default: '' },
        },
        featured: {
            type: Boolean,
            default: false,
            index: true,
        },
        status: {
            type: String,
            enum: ['completed', 'in-progress', 'archived'],
            default: 'completed',
        },
        client: { type: String, default: '' },
        role: { type: String, default: '' },
    },
    {
        timestamps: true,
        collection: 'works',
    }
);

WorkSchema.index({ featured: -1, createdAt: -1 });
WorkSchema.index({ category: 1, status: 1 });

// ✅ Safe registration — never delete mongoose.models.Work.
// Deleting the cached model on every hot-reload causes "Cannot overwrite model
// once compiled" errors and loses the index definitions.
export default mongoose.models.Work || mongoose.model('Work', WorkSchema);