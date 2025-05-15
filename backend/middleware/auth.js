import express from 'express';
import User from '../model/users/regesterUser.js'

const router = express.Router();

// Session storage (in-memory, replace with Redis in production)
const sessions = {};

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create session
    const sessionId = Math.random().toString(36).substring(2);
    sessions[sessionId] = user._id;
    
    res.cookie('sessionId', sessionId, { httpOnly: true });
    res.json({ 
      user: {
        _id: user._id,
        uName: user.uName,
        email: user.email,
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Authentication middleware
export const authMiddleware = (req, res, next) => {
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !sessions[sessionId]) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  req.userId = sessions[sessionId];
  next();
};

// Logout route
router.post('/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    delete sessions[sessionId];
  }
  res.clearCookie('sessionId');
  res.json({ message: 'Logged out' });
});

export default router;