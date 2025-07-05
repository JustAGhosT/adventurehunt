import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get ratings for a hunt
router.get('/hunt/:huntId', async (req, res) => {
  try {
    const { huntId } = req.params;
    res.json({ ratings: [], averageRating: 0 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch ratings' });
  }
});

// Submit rating
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { huntId, rating, comment } = req.body;
    
    const newRating = {
      id: '1',
      huntId,
      rating,
      comment,
      userId: (req as any).userId
    };
    
    res.status(201).json({ rating: newRating });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit rating' });
  }
});

export { router as ratingRoutes };