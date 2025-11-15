import express, { Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import prisma from '../utils/prisma';
import { AppError, handleError } from '../utils/errors';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// All task routes require authentication
router.use(authenticate);

// Get all tasks with pagination, filtering, and searching
router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    query('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']).withMessage('Invalid status'),
    query('search').optional().isString().withMessage('Search must be a string'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string | undefined;
      const search = req.query.search as string | undefined;
      const skip = (page - 1) * limit;

      const where: any = {
        userId: req.userId!,
      };

      if (status) {
        where.status = status;
      }

      if (search && search.trim()) {
        // SQLite search - using contains for partial match
        // Note: SQLite's LIKE is case-insensitive by default for ASCII characters
        where.title = {
          contains: search.trim(),
        };
      }

      const [tasks, total] = await Promise.all([
        prisma.task.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.task.count({ where }),
      ]);

      res.json({
        tasks,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Get single task
router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!,
      },
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    res.json(task);
  } catch (error) {
    handleError(error, res);
  }
});

// Create task
router.post(
  '/',
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').optional().isString(),
    body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']).withMessage('Invalid status'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, description, status } = req.body;

      const task = await prisma.task.create({
        data: {
          title,
          description: description || null,
          status: status || 'PENDING',
          userId: req.userId!,
        },
      });

      res.status(201).json(task);
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Update task
router.patch(
  '/:id',
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional().isString(),
    body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']).withMessage('Invalid status'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if task exists and belongs to user
      const existingTask = await prisma.task.findFirst({
        where: {
          id: req.params.id,
          userId: req.userId!,
        },
      });

      if (!existingTask) {
        throw new AppError('Task not found', 404);
      }

      const updateData: any = {};
      if (req.body.title !== undefined) updateData.title = req.body.title;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.status !== undefined) updateData.status = req.body.status;

      const task = await prisma.task.update({
        where: { id: req.params.id },
        data: updateData,
      });

      res.json(task);
    } catch (error) {
      handleError(error, res);
    }
  }
);

// Delete task
router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    // Check if task exists and belongs to user
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!,
      },
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    await prisma.task.delete({
      where: { id: req.params.id },
    });

    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    handleError(error, res);
  }
});

// Toggle task status
router.patch('/:id/toggle', async (req: AuthRequest, res: Response) => {
  try {
    // Check if task exists and belongs to user
    const task = await prisma.task.findFirst({
      where: {
        id: req.params.id,
        userId: req.userId!,
      },
    });

    if (!task) {
      throw new AppError('Task not found', 404);
    }

    // Toggle status: PENDING -> IN_PROGRESS -> COMPLETED -> PENDING
    let newStatus: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    if (task.status === 'PENDING') {
      newStatus = 'IN_PROGRESS';
    } else if (task.status === 'IN_PROGRESS') {
      newStatus = 'COMPLETED';
    } else {
      newStatus = 'PENDING';
    }

    const updatedTask = await prisma.task.update({
      where: { id: req.params.id },
      data: { status: newStatus },
    });

    res.json(updatedTask);
  } catch (error) {
    handleError(error, res);
  }
});

export default router;

