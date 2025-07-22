const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
        type: String,
        required: [true, 'El contenido del comentario es obligatorio.'],
        trim: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project'
    },
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task'
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
