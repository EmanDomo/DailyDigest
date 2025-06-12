import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  console.log('🔐 AUTH MIDDLEWARE DEBUG:');
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No valid auth header');
    return res.status(401).json({ message: 'Authentication invalid' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token extracted:', token ? 'Yes' : 'No');
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified, payload:', payload);
    
    // Fix: Use the correct property name from your JWT payload
    // This should match what you use when creating the token
    req.user = { 
      id: payload.user_id || payload.userId || payload.id  // Try multiple formats
    };
    
    console.log('User set to:', req.user);
    next();
  } catch (err) {
    console.log('❌ Token verification failed:', err.message);
    res.status(401).json({ message: 'Authentication invalid' });
  }
};

export default authenticateToken;