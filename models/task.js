import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
{
    task_name: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    assigned_to: {
        type: Number,
        required: true,
    }
},
{
    timestamps: true,
});

const User = mongoose.model('Task', taskSchema);

export default User;
