import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../index';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { createError } from '../middleware/errorHandler';
import { aiOrchestrator } from '../index';
import { io } from '../index';

const router = Router();

const createHuntSchema = z.object({
  title: z.string().min(1).max(100),
  theme: z.enum(['pirates', 'nature', 'city', 'space', 'mystery', 'animals']),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  location_type: z.enum(['indoor', 'outdoor', 'mixed']),
  duration: z.number().min(15).max(180).optional()
});

const updateHuntSchema = z.object({
  progress: z.number().min(0).max(100).optional(),
  status: z.enum(['GENERATING', 'READY', 'IN_PROGRESS', 'COMPLETED', 'ERROR']).optional()
});

// POST /api/v1/hunts - Create new hunt
router.post('/', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validatedData = createHuntSchema.parse(req.body);
    
    const hunt = await prisma.hunt.create({
      data: {
        ...validatedData,
        user_id: req.user!.id,
        status: 'GENERATING'
      },
      include: {
        user: true
      }
    });

    // Start AI orchestration asynchronously
    aiOrchestrator.generateHunt(hunt.id, validatedData)
      .then(() => {
        // Notify client via socket when hunt is ready
        io.to(`hunt-${hunt.id}`).emit('hunt-ready', { huntId: hunt.id });
      })
      .catch((error) => {
        console.error('AI orchestration failed:', error);
        // Update hunt status to ERROR
        prisma.hunt.update({
          where: { id: hunt.id },
          data: { status: 'ERROR' }
        });
        io.to(`hunt-${hunt.id}`).emit('hunt-error', { huntId: hunt.id, error: error.message });
      });

    res.status(201).json({
      success: true,
      data: hunt,
      message: 'Hunt creation started! You will be notified when it\'s ready.'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/hunts/:id - Get hunt details
router.get('/:id', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const hunt = await prisma.hunt.findUnique({
      where: { id: req.params.id },
      include: {
        clues: {
          orderBy: { sequence: 'asc' }
        },
        user: true,
        ratings: true
      }
    });

    if (!hunt) {
      throw createError('Hunt not found', 404, 'HUNT_NOT_FOUND');
    }

    // Check if user owns this hunt or if it's public
    if (hunt.user_id !== req.user!.id) {
      throw createError('Access denied', 403, 'ACCESS_DENIED');
    }

    res.json({
      success: true,
      data: hunt
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/v1/hunts/:id - Update hunt progress
router.patch('/:id', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const validatedData = updateHuntSchema.parse(req.body);
    
    const hunt = await prisma.hunt.findUnique({
      where: { id: req.params.id }
    });

    if (!hunt) {
      throw createError('Hunt not found', 404, 'HUNT_NOT_FOUND');
    }

    if (hunt.user_id !== req.user!.id) {
      throw createError('Access denied', 403, 'ACCESS_DENIED');
    }

    const updatedHunt = await prisma.hunt.update({
      where: { id: req.params.id },
      data: validatedData,
      include: {
        clues: {
          orderBy: { sequence: 'asc' }
        }
      }
    });

    // Notify clients via socket
    io.to(`hunt-${hunt.id}`).emit('hunt-updated', { hunt: updatedHunt });

    res.json({
      success: true,
      data: updatedHunt
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/v1/hunts/:id - Delete hunt
router.delete('/:id', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const hunt = await prisma.hunt.findUnique({
      where: { id: req.params.id }
    });

    if (!hunt) {
      throw createError('Hunt not found', 404, 'HUNT_NOT_FOUND');
    }

    if (hunt.user_id !== req.user!.id) {
      throw createError('Access denied', 403, 'ACCESS_DENIED');
    }

    await prisma.hunt.delete({
      where: { id: req.params.id }
    });

    res.json({
      success: true,
      message: 'Hunt deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/hunts/:id/clues - Get clues for hunt
router.get('/:id/clues', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const hunt = await prisma.hunt.findUnique({
      where: { id: req.params.id },
      include: {
        clues: {
          orderBy: { sequence: 'asc' }
        }
      }
    });

    if (!hunt) {
      throw createError('Hunt not found', 404, 'HUNT_NOT_FOUND');
    }

    if (hunt.user_id !== req.user!.id) {
      throw createError('Access denied', 403, 'ACCESS_DENIED');
    }

    res.json({
      success: true,
      data: hunt.clues
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/hunts/:id/status - Get hunt status
router.get('/:id/status', authMiddleware, async (req: AuthenticatedRequest, res, next) => {
  try {
    const hunt = await prisma.hunt.findUnique({
      where: { id: req.params.id },
      select: {
        status: true,
        progress: true,
        updated_at: true
      }
    });

    if (!hunt) {
      throw createError('Hunt not found', 404, 'HUNT_NOT_FOUND');
    }

    const result_url = hunt.status === 'READY' ? `/hunts/${req.params.id}` : null;

    res.json({
      success: true,
      data: {
        status: hunt.status.toLowerCase(),
        progress: hunt.progress,
        updated_at: hunt.updated_at.toISOString(),
        result_url
      }
    });
  } catch (error) {
    next(error);
  }
});

export { router as huntRoutes };