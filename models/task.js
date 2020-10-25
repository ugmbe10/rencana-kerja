import mongoose from 'mongoose'

const taskSchema = mongoose.Schema({
    task_name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        lowercase: true,
    },
    assigned_to: {
        type: String,
    }
}, {
    timestamps: true,
});

const Task = mongoose.model('Task', taskSchema)

export default Task