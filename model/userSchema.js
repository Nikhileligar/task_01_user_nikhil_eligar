import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:  {
        type: String,
    },
    email:  {
        type: String,
        required: [true, 'email field cannot be empty'],
        unique: true
    },
    password:  {
        type: String, 
        required: true,
    },
    phone:  {
        type: String,
        unique: true
    },
    file: {
        type: String
    },
    lastActive: {
        type: String,
        required: false,
    },
    active: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: String,
        required: true,
    },
})

const User = mongoose.models.users_data || mongoose.model ("users_data", userSchema)
console.log(User,'db(2)')
export default User;