const User = require('../../models/User');

describe('User Model', () => {
  describe('Schema Validation', () => {
    it('should create a valid user', async () => {
      const userData = {
        googleId: '123456789',
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'http://example.com/avatar.jpg'
      };

      const user = new User(userData);
      const savedUser = await user.save();

      expect(savedUser._id).toBeDefined();
      expect(savedUser.googleId).toBe(userData.googleId);
      expect(savedUser.name).toBe(userData.name);
      expect(savedUser.email).toBe(userData.email);
      expect(savedUser.avatar).toBe(userData.avatar);
      expect(savedUser.createdAt).toBeDefined();
      expect(savedUser.updatedAt).toBeDefined();
    });

    it('should require googleId', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow('googleId');
    });

    it('should require name', async () => {
      const userData = {
        googleId: '123456789',
        email: 'john@example.com'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow('name');
    });

    it('should require email', async () => {
      const userData = {
        googleId: '123456789',
        name: 'John Doe'
      };

      const user = new User(userData);
      
      await expect(user.save()).rejects.toThrow('email');
    });

    it('should enforce unique googleId', async () => {
      const userData1 = {
        googleId: '123456789',
        name: 'John Doe',
        email: 'john@example.com'
      };

      const userData2 = {
        googleId: '123456789',
        name: 'Jane Smith',
        email: 'jane@example.com'
      };

      const user1 = new User(userData1);
      await user1.save();

      const user2 = new User(userData2);
      await expect(user2.save()).rejects.toThrow();
    });

    it('should enforce unique email', async () => {
      const userData1 = {
        googleId: '123456789',
        name: 'John Doe',
        email: 'john@example.com'
      };

      const userData2 = {
        googleId: '987654321',
        name: 'Jane Smith',
        email: 'john@example.com'
      };

      const user1 = new User(userData1);
      await user1.save();

      const user2 = new User(userData2);
      await expect(user2.save()).rejects.toThrow();
    });
  });
});
