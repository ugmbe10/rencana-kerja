import mongoose from 'mongoose'

const userSchema = mongoose.Schema(
{
    id_user :{
        type :Number,
        required:true
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    }
},
{
    timestamps: true,
});

const User = mongoose.model('User', userSchema);

export default User;