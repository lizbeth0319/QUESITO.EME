import mongoose from 'mongoose';
const { Schema, model, ObjectId } = mongoose;

const userSchema = new Schema({
   /*  _id: { type: ObjectId, unique: true, required: true }, */
    firstName: { type: String, required: true, minlength: 2, trim: true },
    lastName: { type: String, required: true, minlength: 2, trim: true },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true,
        match: [/^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/, 'Correo no válido.']
    },
    password_hash: { type: String, required: true, minlength: 8 },
    avatar: { type: String, default: '' },
    phone: { type: String, trim: true },
    globalRole: { type: String , ref: 'Role', required: true },    //el problema
    isActive: { type: Boolean, default: true },
    isEmailVerified: { type: Boolean, default: false },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const User = model('User', userSchema);

export default User;