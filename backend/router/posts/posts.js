// routes/posts.js
import express from 'express';
import Post from "../../model/posts/posts.js";
import cors from "cors";

const router = express.Router();

// Create post
// routes/posts.js (create endpoint)
router.post('/', async (req, res) => {
    try {
        const { userId, caption, imageUrl } = req.body;
        
        const newPost = await Post.create({
            userId,
            caption,
            imageUrl: imageUrl || null
        });

        const populatedPost = await Post.findById(newPost._id)
            .populate('userId', 'uName profilePicture');

        res.status(201).json({
            ...populatedPost.toObject(),
            user: {
                uName: populatedPost.userId.uName,
                profilePicture: populatedPost.userId.profilePicture || '/default-profile.png'
            }
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Get all posts
// routes/posts.js
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate({
                path: 'userId',
                select: 'uName profilePicture',
                model: 'User' // Explicitly specify the model
            })
            .lean();

        // Transform posts to include user data directly
        const formattedPosts = posts.map(post => ({
            ...post,
            user: {
                _id: post.userId._id,
                uName: post.userId.uName,
                profilePicture: post.userId.profilePicture || '/default-profile.png'
            }
        }));

        res.json(formattedPosts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add this new route
router.patch('/:postId/like', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'User ID required' });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: 'Post not found' });

    const likeIndex = post.likedBy.indexOf(userId);
    const isLiked = likeIndex !== -1;

    if (isLiked) {
      post.likedBy.splice(likeIndex, 1);
      post.likes -= 1;
    } else {
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();
    res.json({ 
      likes: post.likes,
      isLiked: !isLiked
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// routes/posts.js
router.delete('/:id', async (req, res) => {
    try {
        const { userId } = req.body; // Should come from session in real app
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.userId.toString() !== userId) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;