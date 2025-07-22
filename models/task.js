import mongoose from "mongoose";
/*5. Tareas (Tasks)
 _id: ObjectId
 title: String
 description: String
 project: ObjectId (referencia a Project)
 assignedTo: ObjectId (referencia a User)
 createdBy: ObjectId (referencia a User)
 status: ObjectId (referencia a State)
 priority: String (Low, Medium, High, Critical)
 estimatedHours: Number
 actualHours: Number
 startDate: Date
 dueDate: Date
 completedAt: Date
 tags: Array de Strings
 isActive: Boolean
 createdAt: Date
 updatedAt: Date */
const TasksSchema = new mongoose.Schema({
    id_:{type: ObjectId,unique: true,required: true},
    title: {type: String,required: true},
    description: {type: String},
    project: {type: mongoose.Schema.Types.ObjectId,
        ref: 'Project',//de que rpoyecto
        required: true},
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},//de que usuario
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',//de que user
        required: true},
    status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'},//referencia a estado
    priority: {type: String,
        enum: ['Low', 'Medium', 'High', 'Critical'],//datos que se agregan 
        default: 'Medium'},
    estimatedHours: {type: Number},
    actualHours: {type: Number},
    startDate: {type: Date},
    dueDate: {type: Date},
    completedAt: {type: Date},
    tags: {type: [String]},
    isActive: {type: Boolean,default: true},
    createdAt: {type: Date,default: Date.now},
    updatedAt: {type: Date,default: Date.now}
})
