import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user (placeholder)
    const user = {
      id: '1',
      email,
      name,
      password: hashedPassword
    };
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Placeholder user validation
    const user = {
      id: '1',
      email,
      password: await bcrypt.hash('password', 10)
    };
    
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      user: { id: user.id, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
});

export { router as userRoutes };