import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all hunts
router.get('/', async (req, res) => {
  try {
    res.json({ hunts: [] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hunts' });
  }
});

// Get hunt by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ hunt: { id, title: 'Sample Hunt' } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch hunt' });
  }
});

// Create new hunt
router.post('/', authenticateToken, async (req, res) => {
  try {
    const huntData = req.body;
    res.status(201).json({ hunt: { id: '1', ...huntData } });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create hunt' });
  }
});

export { router as huntRoutes };