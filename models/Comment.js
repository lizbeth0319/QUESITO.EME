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
    /* id_:{type: ObjectId,unique: true,required: true}, */
    content: {type: String,required: true,trim: true},
    author: {type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // referencia a la colección de usuarios
    required: true},
    projectid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',  // referencia a la colección de proyectos
    required: true},
    task: { // La tarea a la que pertenece el comentario (puede ser null si es de un proyecto)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: function() { return !this.project; } // Requerido si no hay 'project'
    },
    editedAt: {type: Date},
    createdAt: {type: Date,default: Date.now},
    updatedAt: {type: Date,default: Date.now}
})

export default mongoose.model('Comment', CommentsSchema);

// models/Comment.js (Ejemplo)

/* import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true,
        minlength: [1, 'El comentario no puede estar vacío.']
    },
    author: { // El usuario que hizo el comentario
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: { // El proyecto al que pertenece el comentario (puede ser null si es de una tarea)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',
        required: function() { return !this.task; } // Requerido si no hay 'task'
    },
    task: { // La tarea a la que pertenece el comentario (puede ser null si es de un proyecto)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: function() { return !this.project; } // Requerido si no hay 'project'
    },
    isActive: { // Para "soft-delete"
        type: Boolean,
        default: true
    }
}, { timestamps: true }); // `timestamps: true` añade `createdAt` y `updatedAt` automáticamente

// Middleware para validación condicional: Asegura que haya UNA y SOLO UNA referencia (o project o task)
CommentSchema.pre('validate', function(next) {
    if ((this.project && this.task) || (!this.project && !this.task)) {
        this.invalidate('project', 'Un comentario debe estar asociado a un proyecto O a una tarea, pero no a ambos ni a ninguno.', this.project);
    }
    next();
});

const Comment = mongoose.model('Comment', CommentSchema);
export default Comment; */