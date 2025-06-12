import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // 1. Find user by username
    const user = await User.findByUsername(username);

    // 2. Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Compare passwords (Note: use bcrypt in production!)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' }); 
    }

    // 4. Generate JWT token
    const token = jwt.sign(
      {
        user_id: user.user_id,
        username: user.username,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('✅ Token created for user_id:', user.user_id);

    // 5. Return token and user info
    res.json({
      message: 'Login successful',
      token,
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
};
