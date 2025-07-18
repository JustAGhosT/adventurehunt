import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/errorHandler.js';
import { huntRoutes } from './routes/hunts.js';
import { userRoutes } from './routes/users.js';
import { ratingRoutes } from './routes/ratings.js';
import { AIOrchestrator } from './services/AIOrchestrator.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5174",
    methods: ["GET", "POST"]
  }
});

// Database connection
export const prisma = new PrismaClient();

// Test database connection
prisma.$connect()
  .then(() => console.log('📊 Database connected successfully'))
  .catch((error) => console.error('❌ Database connection failed:', error));

// Initialize AI Orchestrator
export const aiOrchestrator = new AIOrchestrator();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5174",
  credentials: true
}));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/hunts', huntRoutes);
app.use('/api/v1/ratings', ratingRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Socket.IO for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-hunt', (huntId: string) => {
    socket.join(`hunt-${huntId}`);
  });
  
  socket.on('leave-hunt', (huntId: string) => {
    socket.leave(`hunt-${huntId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

export { io };

const PORT = process.env.PORT || 3001;

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend URL: ${process.env.CLIENT_URL || 'http://localhost:5174'}`);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await prisma.$disconnect();
  process.exit(0);
});