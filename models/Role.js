import mongoose from 'mongoose';
const { Schema, model, ObjectId } = mongoose;

const roleSchema = new Schema({
    //_id: { type: ObjectId, unique: true, required: true },automaticamente 
    name: { 
        type: String, 
        required: true, 
        enum: ['Admin', 'Project Manager', 'Developer', 'Viewer'], 
        unique: true, 
        trim: true 
    },
    description: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Role = model('Role', roleSchema);

export default Role;
