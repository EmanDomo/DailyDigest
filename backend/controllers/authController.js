import jwt from 'jsonwebtoken';
import User from '../models/authModel.js';

const authController = {
  login: async (req, res) => {
    const { username, password } = req.body;

    try {
      const user = await User.findByUsername(username);
      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        {
          user_id: user.user_id,
          username: user.username,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.cookie('authToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user.user_id,
          username: user.username,
          role: user.role
        }
      });

    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  logout: async (req, res) => {
    try {
      res.clearCookie('authToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      });

      res.json({ message: 'Logout successful' });
    } catch (error) {
      console.error('❌ Logout error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  getLoggedInUser: async (req, res) => {
    const token = req.cookies.authToken;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.user_id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.user_id,
        name: user.name,
        username: user.username,
        role: user.role
      });

    } catch (error) {
      console.error('❌ Error verifying token:', error);
      res.status(403).json({ message: 'Invalid or expired token' });
    }
  },

  findByUsername: async (req, res) => {
    const { username } = req.params;
    try {
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('❌ Error finding user by username:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

 createUser: async (req, res) => {
  try {
    const { name, username, password } = req.body;

    // Step 1: Check if the username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: 'Username already taken' });
    }

    // Step 2: Create the new user
    const newUser = await User.createUser(name, username, password);

    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });

  } catch (error) {
    console.error('❌ Error creating user:', error);
    res.status(500).json({ message: 'Server error' });
  }
}


};

export default authController;
