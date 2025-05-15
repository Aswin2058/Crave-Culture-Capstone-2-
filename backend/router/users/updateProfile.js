import express from "express";
import multer from "multer";
import path from "path";
import User from "../../model/users/regesterUser.js";

const router = express.Router();

// Configure Multer with file size limit
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(process.cwd(), 'public', 'uploads'));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 4 * 1024 * 1024 // 2MB limit (adjust as needed)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and GIF images are allowed'));
    }
  }
});

router.put('/:id', upload.single('profilePicture'), async (req, res) => {
  try {
    const { uName } = req.body;
    
    if (!uName) {
      return res.status(400).json({ error: "Name is required" });
    }

    const updateData = { uName };

    if (req.file) {
      updateData.profilePicture = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.status(200).json({ 
      success: true,
      user: updatedUser 
    });

  } catch (error) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: "File too large (max 2MB)" });
    }
    if (error.message.includes('image')) {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: "Server error during update" });
  }
});

export default router;