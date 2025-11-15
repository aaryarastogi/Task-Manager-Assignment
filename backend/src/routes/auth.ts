import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import prisma from '../utils/prisma';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError, handleError } from '../utils/errors';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

router.post(
  '/register',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('name').trim().notEmpty().withMessage('Name is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, name } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        throw new AppError('User with this email already exists', 400);
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
      });

      const tokenPayload = { userId: user.id, email: user.email };
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt,
        },
      });

      res.status(201).json({
        message: 'User registered successfully',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      handleError(error, res);
    }
  }
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log(`Login attempt failed: User not found for email: ${email}`);
        throw new AppError('Invalid email or password', 401);
      }

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        console.log(`Login attempt failed: Invalid password for email: ${email}`);
        throw new AppError('Invalid email or password', 401);
      }

      console.log(`Login successful for user: ${user.email}`);

      const tokenPayload = { userId: user.id, email: user.email };
      const accessToken = generateAccessToken(tokenPayload);
      const refreshToken = generateRefreshToken(tokenPayload);

      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);

      await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: user.id,
          expiresAt,
        },
      });

      res.json({
        message: 'Login successful',
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (error) {
      handleError(error, res);
    }
  }
);

router.post('/refresh', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400);
    }

    const payload = verifyRefreshToken(refreshToken);

    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const tokenPayload = { userId: payload.userId, email: payload.email };
    const accessToken = generateAccessToken(tokenPayload);

    res.json({
      accessToken,
    });
  } catch (error) {
    handleError(error, res);
  }
});

router.post('/logout', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
      });
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    handleError(error, res);
  }
});

router.post(
  '/reset-password',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req: Request, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, newPassword } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new AppError('User not found', 404);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });

      await prisma.refreshToken.deleteMany({
        where: { userId: user.id },
      });

      res.json({ message: 'Password reset successful. Please login with your new password.' });
    } catch (error) {
      handleError(error, res);
    }
  }
);

export default router;

