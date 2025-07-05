import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Get all hunts
router.get('/', async (req, res) => {
  try {
    res.json({ hunts: [] });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching hunts' });
  }
});

// Create a new hunt
router.post('/', authMiddleware, async (req, res) => {
  try {
    res.json({ message: 'Hunt created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating hunt' });
  }
});

export { router as huntRoutes };