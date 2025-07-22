const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const taskSchema = new Schema({
    title: {
        type: String,
        required: [true, 'El título de la tarea es obligatorio.'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    project: {
        type: Schema.Types.ObjectId,
        ref: 'Project',
        required: [true, 'El proyecto es obligatorio.']
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        required: [true, 'El estado es obligatorio.']
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    dueDate: {
        type: Date
    },
    dependencies: [{
        type: Schema.Types.ObjectId,
        ref: 'Task'
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
