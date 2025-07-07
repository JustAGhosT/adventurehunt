import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index.js';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  age_group: z.string().min(1, 'Age group is required'),
  preferences: z.object({
    difficulty_preference: z.string().optional(),
    favorite_themes: z.array(z.string()).optional()
  }).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

// Create user (simplified for children - no email/password required)
router.post('/', async (req, res) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    
    // Create user in database
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        age_group: validatedData.age_group,
        preferences: validatedData.preferences || {}
      }
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          age_group: user.age_group,
          preferences: user.preferences
        },
        token
      }
    });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid input data',
          details: error.errors
        }
      });
    }
    
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to create user'
      }
    });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        hunts: {
          orderBy: { created_at: 'desc' },
          take: 10
        },
        ratings: {
          orderBy: { created_at: 'desc' },
          take: 5
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'User not found' }
      });
    }
    
    res.json({
      success: true,
      data: { user }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Failed to fetch user' }
    });
  }
});

// Register user (traditional email/password - optional)
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, age_group } = loginSchema.extend({
      name: z.string().min(1),
      age_group: z.string().min(1)
    }).parse(req.body);
    
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { name: email } // Using name field for email temporarily
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'User already exists' }
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        age_group,
        preferences: { email, hashedPassword } // Store in preferences for now
      }
    });
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      success: true,
      data: {
        user: { id: user.id, email, name: user.name, age_group: user.age_group },
        token
      }
    });
  } catch (error: any) {
    console.error('Error registering user:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid input data', details: error.errors }
      });
    }
    
    res.status(500).json({
      success: false,
      error: { message: 'Failed to register user' }
    });
  }
});

// Login user (traditional email/password - optional)
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    
    // Find user by email (stored in preferences)
    const user = await prisma.user.findFirst({
      where: {
        preferences: {
          path: ['email'],
          equals: email
        }
      }
    });
    
    if (!user || !user.preferences || typeof user.preferences !== 'object') {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }
    
    const userPrefs = user.preferences as any;
    const isValidPassword = await bcrypt.compare(password, userPrefs.hashedPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials' }
      });
    }
    
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
    
    res.json({
      success: true,
      data: {
        user: { id: user.id, email, name: user.name, age_group: user.age_group },
        token
      }
    });
  } catch (error: any) {
    console.error('Error logging in user:', error);
    
    if (error.name === 'ZodError') {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid input data', details: error.errors }
      });
    }
    
    res.status(500).json({
      success: false,
      error: { message: 'Failed to login' }
    });
  }
});

export { router as userRoutes };