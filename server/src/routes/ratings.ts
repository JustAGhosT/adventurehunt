import { Router } from 'express';

const router = Router();

// Get ratings for a hunt
router.get('/hunt/:huntId', async (req, res) => {
  try {
    const { huntId } = req.params;
    res.json({ ratings: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ratings' });
  }
});

// Create a rating
router.post('/', async (req, res) => {
  try {
    res.json({ message: 'Rating created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating rating' });
  }
});

export { router as ratingRoutes };