import { Router } from 'express';

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
router.post('/', async (req, res) => {
  try {
    res.json({ message: 'Hunt created successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error creating hunt' });
  }
});

export { router as huntRoutes };