// router/community/community.js
import express from "express";
import Community from "../../model/communities/Community.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
      const data = await Community.find().sort({ createdAt: -1 });
      console.log("Sending communities data:", data); // Add this
      res.json(data);
    } catch (err) {
      console.error("Error fetching communities:", err);
      res.status(500).json({ error: "Failed to fetch communities." });
    }
  });

// POST - Create a new community
router.post("/", async (req, res) => {
    console.log("Received POST with data:", req.body);
    try {
      const newCommunity = new Community(req.body);
      const saved = await newCommunity.save();
      console.log("Saved community:", saved);
      res.status(201).json(saved);
    } catch (err) {
      console.error("Save error:", err);
      res.status(400).json({ error: err.message });
    }
  });

// PUT - React to a community
router.put("/:id/react", async (req, res) => {
  const { type } = req.body; // likes, dislikes, loves
  try {
    const update = { $inc: { [type]: 1 } };
    const updated = await Community.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Reaction failed." });
  }
});

// POST - Add a comment
router.post("/:id/comment", async (req, res) => {
  const { text } = req.body;
  try {
    const updated = await Community.findByIdAndUpdate(
      req.params.id,
      { $push: { comments: { text } } },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: "Failed to add comment." });
  }
});

// PUT - Toggle join
router.put("/:id/toggleJoin", async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ error: "Not found" });

    community.joined = !community.joined;
    await community.save();
    res.json(community);
  } catch (err) {
    res.status(400).json({ error: "Failed to toggle join." });
  }
});

export default router;