import mongoose from 'mongoose';
const { Schema, model, ObjectId } = mongoose;

const projectSchema = new Schema({
   /*  _id: { type: ObjectId, unique: true, required: true }, */
    name: { type: String, required: true, trim: true, unique: true, minlength: 3 },
    description: { type: String, trim: true },
    category: { type: ObjectId, ref: 'Category', required: true },
    owner: { type: ObjectId, ref: 'User', required: true },
    members: [{
        user: { type: ObjectId, ref: 'User', required: true },
        role: { type: ObjectId, ref: 'Role', required: true },
        joinedAt: { type: Date, default: Date.now }
    }],
    status: { type: ObjectId, ref: 'State', required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    estimatedHours: { type: Number, min: 0 },
    actualHours: { type: Number, min: 0 },
    budget: { type: Number, min: 0 },
    tags: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Project = model('Project', projectSchema);

export default Project;
