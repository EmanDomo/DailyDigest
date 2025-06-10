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

    // 3. Compare passwords (plain text comparison - not secure!)
    // In real apps, use bcrypt.compare() with hashed passwords
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 4. Successful login
    res.json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        username: user.username,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};