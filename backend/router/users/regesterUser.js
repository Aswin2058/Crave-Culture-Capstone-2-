import express from "express";
import User from "../../model/users/regesterUser.js";

const router = express.Router();

router.post("/", async (req, res) => {
    const { uName, email, password } = req.body;

    try {
        if (!uName || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        const newUser = await User.create({ 
            uName, 
            email, 
            password,
            profilePicture: '' // Initialize empty
        });
        
        // Return consistent structure with login
        res.status(201).json({
            user: {
                _id: newUser._id,
                uName: newUser.uName,
                email: newUser.email,
                profilePicture: newUser.profilePicture
            }
        });
    } catch (error) {
        res.status(400).json({ 
            error: error.message.includes('duplicate key') 
                ? 'Email already in use' 
                : error.message 
        });
    }
});
export default router;