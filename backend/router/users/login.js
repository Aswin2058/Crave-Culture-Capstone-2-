import express from "express";
import User from "../../model/users/regesterUser.js";

const router = express.Router();

// Login route
router.post("/", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Simple password comparison (no bcrypt)
        if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }

        // Return user data without password
        const userData = {
            _id: user._id,
            uName: user.uName,
            email: user.email,
            profilePicture: user.profilePicture
        };

        res.status(200).json({
            user: userData,
            token: "simple-session-token" // Just a placeholder
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;