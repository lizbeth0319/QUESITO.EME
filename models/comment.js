import mongoose from "mongoose";
/* 6. Comentarios (Comments) sobre los proyectos

 _id: ObjectId
 content: String
 author: ObjectId (referencia a User)
 projectid: (referencia a Projects)
 editedAt: Date
 createdAt: Date
 updatedAt: Date*/
const CommentsSchema = new mongoose.Schema({
    id_:{type: ObjectId,unique: true,required: true},
    content: {type: String,required: true},
    author: {type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // referencia a la colección de usuarios
    required: true},
    projectid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',  // referencia a la colección de proyectos
    required: true},
    editedAt: {type: Date},
    createdAt: {type: Date,default: Date.now},
    updatedAt: {type: Date,default: Date.now}
})