import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d'; // Token valid for 7 days
const SALT_ROUNDS = 10;

class AuthService {
  
  // Hash password
  async hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
  }

  // Compare password with hash
  async comparePassword(password, hash) {
    return await bcrypt.compare(password, hash);
  }

  // Generate JWT token
  generateToken(userId, username) {
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET not configured');
    }

    return jwt.sign(
      { id: userId, username: username },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // Register new user
  async register(name, username, password) {
    const connection = await db.getConnection();
    
    try {
      // Check if user already exists
      const [existing] = await connection.execute(
        'SELECT id FROM users WHERE username = ?',
        [username]
      );

      if (existing.length > 0) {
        return {
          success: false,
          message: 'Username already exists'
        };
      }

      // Hash password
      const hashedPassword = await this.hashPassword(password);

      // Insert user
      const [result] = await connection.execute(
        'INSERT INTO users (name, username, password) VALUES (?, ?, ?)',
        [name, username, hashedPassword]
      );

      const userId = result.insertId;

      // Create user-specific workout table
      const tableName = `user_${userId}_workouts`;
      await connection.execute(`
        CREATE TABLE ${tableName} (
          id INT AUTO_INCREMENT PRIMARY KEY,
          date DATE NOT NULL,
          exercise VARCHAR(255) NOT NULL,
          weight DECIMAL(10, 2) NOT NULL,
          number_of_sets INT NOT NULL,
          number_of_reps INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX idx_date (date),
          INDEX idx_exercise (exercise)
        )
      `);

      // Generate token
      const token = this.generateToken(userId, username);

      return {
        success: true,
        token,
        user: {
          id: userId,
          name,
          username
        }
      };

    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: 'Registration failed'
      };
    } finally {
      connection.release();
    }
  }

  // Login user
  async login(username, password) {
    const connection = await db.getConnection();
    
    try {
      // Get user
      const [users] = await connection.execute(
        'SELECT id, name, username, password FROM users WHERE username = ?',
        [username]
      );

      if (users.length === 0) {
        return {
          success: false,
          message: 'Invalid username or password'
        };
      }

      const user = users[0];

      // Verify password
      const isValid = await this.comparePassword(password, user.password);

      if (!isValid) {
        return {
          success: false,
          message: 'Invalid username or password'
        };
      }

      // Generate token
      const token = this.generateToken(user.id, user.username);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          name: user.name,
          username: user.username
        }
      };

    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Login failed'
      };
    } finally {
      connection.release();
    }
  }
}

const authService = new AuthService();

export default authService;
