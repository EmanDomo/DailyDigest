import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  console.log('🔐 AUTH MIDDLEWARE DEBUG:');

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No Bearer token in Authorization header');
    return res.status(401).json({ message: 'Authentication required' });
  }

  const token = authHeader.split(' ')[1];
  console.log('Token extracted from Authorization header:', token ? 'Yes' : 'No');
  console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified, payload:', payload);

    req.user = {
      id: payload.user_id || payload.userId || payload.id
    };

    console.log('User set to:', req.user);
    next();
  } catch (err) {
    console.log('❌ Token verification failed:', err.message);
    res.status(401).json({ message: 'Authentication invalid' });
  }
};

export default authenticateToken;
