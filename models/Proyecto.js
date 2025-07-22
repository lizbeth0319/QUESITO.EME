const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    name: {
        type: String,
        required: [true, 'El nombre del proyecto es obligatorio.'],
        trim: true,
        unique: true,
        minlength: [3, 'El nombre debe tener al menos 3 caracteres.']
    },
    description: {
        type: String,
        trim: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'La categoría es obligatoria.']
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El propietario es obligatorio.']
    },
    members: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        role: {
            type: Schema.Types.ObjectId,
            ref: 'Role',
            required: true
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    status: {
        type: Schema.Types.ObjectId,
        ref: 'State',
        required: [true, 'El estado del proyecto es obligatorio.']
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],
        default: 'Medium'
    },
    startDate: {
        type: Date,
        required: [true, 'La fecha de inicio es obligatoria.']
    },
    endDate: {
        type: Date
    },
    estimatedHours: {
        type: Number,
        min: [0, 'Las horas estimadas no pueden ser negativas.']
    },
    actualHours: {
        type: Number,
        min: [0, 'Las horas reales no pueden ser negativas.']
    },
    budget: {
        type: Number,
        min: [0, 'El presupuesto no puede ser negativo.']
    },
    isActive: {
        type: Boolean,
        default: true
    },
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

const Project = mongoose.model('Project', projectSchema);

module.exports = Project;
