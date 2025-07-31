import mongoose from 'mongoose';
const { Schema, model, ObjectId } = mongoose;

const categorySchema = new Schema({
   /*  _id: { type: ObjectId, unique: true, required: true }, */
    name: { type: String, required: true, trim: true, unique: true, minlength: 2 },
    description: { type: String, trim: true },
    createdBy: { type: ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Category = model('Category', categorySchema);

export default Category;