import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    uName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        default: ''
    }
}, {timestamps: true});

export default mongoose.model("User", userSchema);