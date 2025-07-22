const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stateSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del estado es obligatorio.'],
        enum: ['Pending', 'In Progress', 'Completed', 'Archived'],
        unique: true
    },
    description: {
        type: String,
        trim: true
    },
    appliesTo: {
        type: String,
        enum: ['Project', 'Task', 'Both'],
        default: 'Both'
    },
    allowedTransitions: [{
        type: String,
        enum: ['Pending', 'In Progress', 'Completed', 'Archived']
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

const State = mongoose.model('State', stateSchema);

module.exports = State;
