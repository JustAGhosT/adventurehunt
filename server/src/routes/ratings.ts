import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';

const router = Router();

const createRatingSchema = z.object({
  hunt_id: z.string(),
  engagement_score: z.number().min(1).max(5),
  difficulty_rating: z.number().min(1).max(5),
  feedback: z.string().max(500).optional(),
  completed: z.boolean().default(false),
  completion_time: z.number().min(1).optional()
});

// POST /api/v1/ratings - Submit hunt rating
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validatedData = createRatingSchema.parse(req.body);
    
    // Check if hunt exists
    const hunt = await prisma.hunt.findUnique({
      where: { id: validatedData.hunt_id }
    });

    if (!hunt) {
      throw createError('Hunt not found', 404, 'HUNT_NOT_FOUND');
    }

    // Check if user already rated this hunt
    const existingRating = await prisma.rating.findFirst({
      where: {
        hunt_id: validatedData.hunt_id,
        user_id: req.user!.id
      }
    });

    if (existingRating) {
      throw createError('You have already rated this hunt', 400, 'RATING_EXISTS');
    }

    const rating = await prisma.rating.create({
      data: {
        ...validatedData,
        user_id: req.user!.id
      },
      include: {
        hunt: true,
        user: true
      }
    });

    res.status(201).json({
      success: true,
      data: rating
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/ratings/hunt/:huntId - Get ratings for a hunt
router.get('/hunt/:huntId', async (req, res, next) => {
  try {
    const ratings = await prisma.rating.findMany({
      where: { hunt_id: req.params.huntId },
      include: {
        user: {
          select: {
            name: true,
            age_group: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Calculate average ratings
    const avgEngagement = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.engagement_score, 0) / ratings.length 
      : 0;
    
    const avgDifficulty = ratings.length > 0 
      ? ratings.reduce((sum, r) => sum + r.difficulty_rating, 0) / ratings.length 
      : 0;

    res.json({
      success: true,
      data: {
        ratings,
        statistics: {
          total_ratings: ratings.length,
          average_engagement: Math.round(avgEngagement * 10) / 10,
          average_difficulty: Math.round(avgDifficulty * 10) / 10,
          completion_rate: ratings.length > 0 
            ? (ratings.filter(r => r.completed).length / ratings.length) * 100 
            : 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as ratingRoutes };