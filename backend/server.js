import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import registerUser from "./router/users/regesterUser.js";
import posts from "./router/posts/posts.js";
import loginUser from "./router/users/login.js";
import updateProfile from "./router/users/updateProfile.js";
import communityRouter from "./router/communities/community.js"

const app = express();
dotenv.config();

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// CORS - Updated for better security
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static Files - Single consistent approach
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Routes
app.use("/user/register", registerUser);
app.use("/api/posts", posts);
app.use("/user/login", loginUser);
app.use("/user/profile", updateProfile);
app.use("/api/community", communityRouter);

// Handle 404 (must be after all routes)
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Generic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Internal server error" });
});

// Database connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        app.listen(process.env.PORT || 4000, () => {
            console.log(`Server running on port ${process.env.PORT || 4000}`);
            console.log("MongoDB connected successfully");
        });
    })
    .catch((error) => console.log("MongoDB connection error:", error));