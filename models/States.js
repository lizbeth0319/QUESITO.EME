import mongoose from 'mongoose';
/* Estados (States)
 _id: ObjectId
 name: String
 description: String
 type: String (Project, Task)
 isActive: Boolean
 createdAt: Date
 updatedAt: Date*/
const statusSchema = new mongoose.Schema({
   /*  _id:{type: ObjectId,unique: true,required: true}, */
    Name: {type: String,required: true},
    description: {type: String},
    type: {type: String,enum: ['Project', 'Task'],required: true},
    isActive: {type: Boolean,default: true},
    createdAt: {type: Date,default: Date.now},
    updatedAt: {type: Date,default: Date.now}
})

export default mongoose.model('Status', statusSchema);