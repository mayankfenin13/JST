const Movie = require('../../models/Movie');
const User = require('../../models/User');

describe('Movie Model', () => {
  let testUser;

  beforeEach(async () => {
    // Create a test user for movie references
    testUser = new User({
      googleId: '123456789',
      name: 'Test User',
      email: 'test@example.com'
    });
    await testUser.save();
  });

  describe('Schema Validation', () => {
    it('should create a valid movie', async () => {
      const movieData = {
        title: 'Test Movie',
        director: 'Test Director',
        releaseYear: 2023,
        genre: 'Action',
        userId: testUser._id
      };

      const movie = new Movie(movieData);
      const savedMovie = await movie.save();

      expect(savedMovie._id).toBeDefined();
      expect(savedMovie.title).toBe(movieData.title);
      expect(savedMovie.director).toBe(movieData.director);
      expect(savedMovie.releaseYear).toBe(movieData.releaseYear);
      expect(savedMovie.genre).toBe(movieData.genre);
      expect(savedMovie.userId.toString()).toBe(testUser._id.toString());
      expect(savedMovie.createdAt).toBeDefined();
      expect(savedMovie.updatedAt).toBeDefined();
    });

    it('should require title', async () => {
      const movieData = {
        director: 'Test Director',
        releaseYear: 2023,
        genre: 'Action',
        userId: testUser._id
      };

      const movie = new Movie(movieData);
      
      await expect(movie.save()).rejects.toThrow('title');
    });

    it('should require director', async () => {
      const movieData = {
        title: 'Test Movie',
        releaseYear: 2023,
        genre: 'Action',
        userId: testUser._id
      };

      const movie = new Movie(movieData);
      
      await expect(movie.save()).rejects.toThrow('director');
    });

    it('should require releaseYear', async () => {
      const movieData = {
        title: 'Test Movie',
        director: 'Test Director',
        genre: 'Action',
        userId: testUser._id
      };

      const movie = new Movie(movieData);
      
      await expect(movie.save()).rejects.toThrow('releaseYear');
    });

    it('should require genre', async () => {
      const movieData = {
        title: 'Test Movie',
        director: 'Test Director',
        releaseYear: 2023,
        userId: testUser._id
      };

      const movie = new Movie(movieData);
      
      await expect(movie.save()).rejects.toThrow('genre');
    });

    it('should require userId', async () => {
      const movieData = {
        title: 'Test Movie',
        director: 'Test Director',
        releaseYear: 2023,
        genre: 'Action'
      };

      const movie = new Movie(movieData);
      
      await expect(movie.save()).rejects.toThrow('userId');
    });

    it('should validate releaseYear minimum (1900)', async () => {
      const movieData = {
        title: 'Test Movie',
        director: 'Test Director',
        releaseYear: 1899,
        genre: 'Action',
        userId: testUser._id
      };

      const movie = new Movie(movieData);
      
      await expect(movie.save()).rejects.toThrow();
    });

    it('should validate releaseYear maximum (current year + 5)', async () => {
      const currentYear = new Date().getFullYear();
      const movieData = {
        title: 'Test Movie',
        director: 'Test Director',
        releaseYear: currentYear + 6,
        genre: 'Action',
        userId: testUser._id
      };

      const movie = new Movie(movieData);
      
      await expect(movie.save()).rejects.toThrow();
    });

    it('should trim whitespace from title and director', async () => {
      const movieData = {
        title: '  Test Movie  ',
        director: '  Test Director  ',
        releaseYear: 2023,
        genre: 'Action',
        userId: testUser._id
      };

      const movie = new Movie(movieData);
      const savedMovie = await movie.save();

      expect(savedMovie.title).toBe('Test Movie');
      expect(savedMovie.director).toBe('Test Director');
    });
  });

  describe('Indexes', () => {
    it('should have text index on title and director', async () => {
      const indexes = await Movie.collection.getIndexes();
      
      // Check if text index exists
      const textIndex = Object.values(indexes).find(index => 
        index.some && index.some(field => field[1] === 'text')
      );
      
      expect(textIndex).toBeDefined();
    });

    it('should have index on userId', async () => {
      const indexes = await Movie.collection.getIndexes();
      expect(indexes).toHaveProperty('userId_1');
    });
  });
});
