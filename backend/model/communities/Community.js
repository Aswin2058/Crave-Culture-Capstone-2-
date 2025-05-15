// models/Community.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  date: { type: Date, default: Date.now }
});

const communitySchema = new mongoose.Schema({
  country: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // URL or base64 if needed
  details: { type: String, default: "More content coming soon..." },
  joined: { type: Boolean, default: false },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  loves: { type: Number, default: 0 },
  comments: [commentSchema],
}, { timestamps: true });

export default mongoose.model("Community", communitySchema);