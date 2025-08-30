const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const Movie = require('../../models/Movie');
const movieRouter = require('../../routes/movies');

// Create test app
const app = express();
app.use(express.json());
app.use('/api/movies', movieRouter);

describe('Movie Routes', () => {
  let testUser;
  let validToken;

  beforeEach(async () => {
    // Create test user
    testUser = new User({
      googleId: '123456789',
      name: 'Test User',
      email: 'test@example.com'
    });
    await testUser.save();

    // Generate valid token
    validToken = jwt.sign(
      { userId: testUser._id, email: testUser.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    );
  });

  describe('GET /api/movies', () => {
    beforeEach(async () => {
      // Create test movies
      const movies = [
        {
          title: 'Movie 1',
          director: 'Director 1',
          releaseYear: 2023,
          genre: 'Action',
          userId: testUser._id
        },
        {
          title: 'Movie 2',
          director: 'Director 2',
          releaseYear: 2022,
          genre: 'Drama',
          userId: testUser._id
        },
        {
          title: 'Another Movie',
          director: 'Another Director',
          releaseYear: 2021,
          genre: 'Comedy',
          userId: testUser._id
        }
      ];
      await Movie.insertMany(movies);
    });

    it('should return user movies with valid token', async () => {
      const response = await request(app)
        .get('/api/movies')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('movies');
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('currentPage');
      expect(response.body).toHaveProperty('total');
      expect(response.body.movies).toHaveLength(3);
      expect(response.body.total).toBe(3);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/movies');

      expect(response.status).toBe(401);
    });

    it('should support search functionality', async () => {
      const response = await request(app)
        .get('/api/movies?search=Movie 1')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.movies).toHaveLength(1);
      expect(response.body.movies[0].title).toBe('Movie 1');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/movies?page=1&limit=2')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.movies).toHaveLength(2);
      expect(response.body.currentPage).toBe('1');
      expect(response.body.totalPages).toBe(2);
    });

    it('should only return movies for authenticated user', async () => {
      // Create another user
      const otherUser = new User({
        googleId: '987654321',
        name: 'Other User',
        email: 'other@example.com'
      });
      await otherUser.save();

      // Create movie for other user
      const otherMovie = new Movie({
        title: 'Other User Movie',
        director: 'Other Director',
        releaseYear: 2023,
        genre: 'Horror',
        userId: otherUser._id
      });
      await otherMovie.save();

      const response = await request(app)
        .get('/api/movies')
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body.movies).toHaveLength(3); // Only test user's movies
      expect(response.body.movies.every(movie => movie.title !== 'Other User Movie')).toBe(true);
    });
  });

  describe('GET /api/movies/:id', () => {
    let testMovie;

    beforeEach(async () => {
      testMovie = new Movie({
        title: 'Test Movie',
        director: 'Test Director',
        releaseYear: 2023,
        genre: 'Action',
        userId: testUser._id
      });
      await testMovie.save();
    });

    it('should return specific movie with valid token and ID', async () => {
      const response = await request(app)
        .get(`/api/movies/${testMovie._id}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', 'Test Movie');
      expect(response.body).toHaveProperty('director', 'Test Director');
    });

    it('should return 404 for non-existent movie', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/movies/${nonExistentId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Movie not found');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get(`/api/movies/${testMovie._id}`);

      expect(response.status).toBe(401);
    });
  });

  describe('POST /api/movies', () => {
    const validMovieData = {
      title: 'New Movie',
      director: 'New Director',
      releaseYear: 2023,
      genre: 'Action'
    };

    it('should create new movie with valid data', async () => {
      const response = await request(app)
        .post('/api/movies')
        .set('Authorization', `Bearer ${validToken}`)
        .send(validMovieData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('title', validMovieData.title);
      expect(response.body).toHaveProperty('userId', testUser._id.toString());
    });

    it('should return 400 with missing required fields', async () => {
      const invalidData = {
        title: 'New Movie'
        // Missing director, releaseYear, genre
      };

      const response = await request(app)
        .post('/api/movies')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Validation failed');
    });

    it('should return 400 with invalid release year', async () => {
      const invalidData = {
        ...validMovieData,
        releaseYear: 1800 // Below minimum
      };

      const response = await request(app)
        .post('/api/movies')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/movies')
        .send(validMovieData);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/movies/:id', () => {
    let testMovie;
    const updateData = {
      title: 'Updated Movie',
      director: 'Updated Director',
      releaseYear: 2024,
      genre: 'Drama'
    };

    beforeEach(async () => {
      testMovie = new Movie({
        title: 'Original Movie',
        director: 'Original Director',
        releaseYear: 2023,
        genre: 'Action',
        userId: testUser._id
      });
      await testMovie.save();
    });

    it('should update movie with valid data', async () => {
      const response = await request(app)
        .put(`/api/movies/${testMovie._id}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('title', updateData.title);
      expect(response.body).toHaveProperty('director', updateData.director);
    });

    it('should return 404 for non-existent movie', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .put(`/api/movies/${nonExistentId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Movie not found');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .put(`/api/movies/${testMovie._id}`)
        .send(updateData);

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /api/movies/:id', () => {
    let testMovie;

    beforeEach(async () => {
      testMovie = new Movie({
        title: 'Movie to Delete',
        director: 'Director',
        releaseYear: 2023,
        genre: 'Action',
        userId: testUser._id
      });
      await testMovie.save();
    });

    it('should delete movie with valid ID', async () => {
      const response = await request(app)
        .delete(`/api/movies/${testMovie._id}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Movie deleted successfully');

      // Verify movie is deleted
      const deletedMovie = await Movie.findById(testMovie._id);
      expect(deletedMovie).toBeNull();
    });

    it('should return 404 for non-existent movie', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/movies/${nonExistentId}`)
        .set('Authorization', `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Movie not found');
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .delete(`/api/movies/${testMovie._id}`);

      expect(response.status).toBe(401);
    });
  });
});
