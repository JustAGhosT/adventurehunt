import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { createError } from '../middleware/errorHandler';

const router = Router();

const createUserSchema = z.object({
  name: z.string().min(1).max(50),
  age_group: z.enum(['6-8', '9-12']),
  preferences: z.object({
    favorite_themes: z.array(z.string()).optional(),
    difficulty_preference: z.enum(['easy', 'medium', 'hard']).optional()
  }).optional()
});

// POST /api/v1/users - Create new user
router.post('/', async (req, res, next) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    
    const user = await prisma.user.create({
      data: validatedData
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        name: user.name, 
        age_group: user.age_group 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/users/:id - Get user details
router.get('/:id', async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: {
        hunts: {
          orderBy: { created_at: 'desc' },
          take: 10
        }
      }
    });

    if (!user) {
      throw createError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
});

export { router as userRoutes };