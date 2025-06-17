// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import cookieParser from 'cookie-parser'; // ADD THIS
// import db from './config/db.js';
// import authRoutes from './routes/authRoutes.js';
// import poopRoutes from './routes/poopRoutes.js';

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true // IMPORTANT: This must be true for cookies to work
// }));
// app.use(express.json());
// app.use(cookieParser()); // ADD THIS MIDDLEWARE

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/poop-records', poopRoutes);

// // Database connection
// db.getConnection()
//   .then(() => console.log('Connected to MySQL'))
//   .catch(err => console.error('Connection failed:', err));

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import poopRoutes from './routes/poopRoutes.js';

dotenv.config();
const app = express();

console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔑 JWT Secret exists:', !!process.env.JWT_SECRET);

// Enhanced CORS configuration for production
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://dailydigestpoopy.netlify.app'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Essential for cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With', 
    'Content-Type', 
    'Accept',
    'Authorization',
    'Cookie'
  ],
  exposedHeaders: ['Set-Cookie'],
  optionsSuccessStatus: 200 // Some legacy browsers choke on 204
};

app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Add a middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  console.log('🍪 Cookies:', Object.keys(req.cookies));
  console.log('🔍 Headers:', req.headers.origin);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/poop-records', poopRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    env: process.env.NODE_ENV,
    cookies: Object.keys(req.cookies)
  });
});

// Test PostgreSQL connection
db.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL');
    client.release();
  })
  .catch(err => console.error('❌ PostgreSQL connection failed:', err));

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
});