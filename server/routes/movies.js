const express = require('express');
const Movie = require('../models/Movie');
const { authenticateToken } = require('./auth');
const router = express.Router();

// Get all movies for authenticated user with search and pagination
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const userId = req.user.userId;
    
    let query = { userId };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { director: { $regex: search, $options: 'i' } }
      ];
    }
    
    const movies = await Movie.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Movie.countDocuments(query);
    
    res.json({
      movies,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ message: 'Error fetching movies' });
  }
});

// Get single movie
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const movie = await Movie.findOne({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json(movie);
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({ message: 'Error fetching movie' });
  }
});

// Create new movie
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, director, releaseYear, genre } = req.body;
    
    // Validation
    if (!title || !director || !releaseYear || !genre) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    const movie = new Movie({
      title,
      director,
      releaseYear: parseInt(releaseYear),
      genre,
      userId: req.user.userId
    });
    
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    console.error('Error creating movie:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error creating movie' });
  }
});

// Update movie
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, director, releaseYear, genre } = req.body;
    
    const movie = await Movie.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { title, director, releaseYear: parseInt(releaseYear), genre },
      { new: true, runValidators: true }
    );
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json(movie);
  } catch (error) {
    console.error('Error updating movie:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Error updating movie' });
  }
});

// Delete movie
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const movie = await Movie.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.userId 
    });
    
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error('Error deleting movie:', error);
    res.status(500).json({ message: 'Error deleting movie' });
  }
});

module.exports = router;