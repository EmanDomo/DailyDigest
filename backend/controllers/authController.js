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

    // 3. Compare passwords
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

    // 5. SET COOKIE INSTEAD OF RETURNING TOKEN
    res.cookie('authToken', token, {
      httpOnly: true,        // Prevents XSS attacks
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'lax',       // CSRF protection
      maxAge: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
    });

    // 6. Return success without exposing token
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
};

export const logout = async (req, res) => {
  try {
    // Clear the cookie
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
};

export const getLoggedInUser = async (req, res) => {
  const token = req.cookies.authToken;
  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Make sure this matches login

    // ✅ Note: Using decoded.user_id (not decoded.id)
    const user = await User.findById(decoded.user_id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

   res.json({
  id: user.user_id,
  username: user.username,
  role: user.role
});

  } catch (error) {
    console.error('❌ Error verifying token:', error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};
