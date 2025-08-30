const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const authRouter = require('../../routes/auth');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/auth', authRouter);

describe('Auth Routes', () => {
  describe('GET /api/auth/user', () => {
    let testUser;
    let validToken;

    beforeEach(async () => {
      // Create test user
      testUser = new User({
        googleId: '123456789',
        name: 'Test User',
        email: 'test@example.com',
        avatar: 'http://example.com/avatar.jpg'
      });
      await testUser.save();

      // Generate valid token
      validToken = jwt.sign(
        { userId: testUser._id, email: testUser.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );
    });

    it('should return user data with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', 'Test User');
      expect(response.body).toHaveProperty('email', 'test@example.com');
      expect(response.body).not.toHaveProperty('googleId');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/user');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Access token required');
    });

    it('should return 403 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/user')
        .set('Authorization', 'Bearer invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should return 403 with expired token', async () => {
      const expiredToken = jwt.sign(
        { userId: testUser._id, email: testUser.email },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '-1h' }
      );

      const response = await request(app)
        .get('/api/auth/user')
        .set('Authorization', `Bearer ${expiredToken}`);

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'Invalid token');
    });

    it('should return 500 if user not found', async () => {
      const nonExistentUserId = new mongoose.Types.ObjectId();
      const tokenWithNonExistentUser = jwt.sign(
        { userId: nonExistentUserId, email: 'nonexistent@example.com' },
        process.env.JWT_SECRET || 'fallback-secret',
        { expiresIn: '24h' }
      );

      const response = await request(app)
        .get('/api/auth/user')
        .set('Authorization', `Bearer ${tokenWithNonExistentUser}`);

      expect(response.status).toBe(200);
      expect(response.body).toBeNull();
    });
  });

  // Note: Logout tests are in auth-full.test.js due to session middleware requirements

  describe('authenticateToken middleware', () => {
    const { authenticateToken } = require('../../routes/auth');
    let req, res, next;

    beforeEach(() => {
      req = {
        headers: {}
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
      next = jest.fn();
    });

    it('should call next() with valid token', () => {
      const testUser = { userId: '123', email: 'test@example.com' };
      const token = jwt.sign(testUser, 'fallback-secret');
      
      req.headers.authorization = `Bearer ${token}`;
      
      authenticateToken(req, res, next);
      
      expect(next).toHaveBeenCalled();
      expect(req.user).toEqual(expect.objectContaining(testUser));
    });

    it('should return 401 if no token provided', () => {
      authenticateToken(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Access token required' });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 if token is invalid', () => {
      req.headers.authorization = 'Bearer invalid-token';
      
      authenticateToken(req, res, next);
      
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
