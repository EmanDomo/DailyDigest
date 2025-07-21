// ===============MYSQL===============

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

// ===============POSTGRESQL===============
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import poopRoutes from './routes/poopRoutes.js';

dotenv.config();
const app = express();

console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔑 JWT Secret exists:', !!process.env.JWT_SECRET);

//CORS configuration with credentials support
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://dailydigestpoopy.netlify.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization'
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

//Middleware
app.use(express.json());

//Log requests (optional, but useful)
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  console.log('🔍 Origin:', req.headers.origin);
  next();
});

//Routes
app.use('/api/auth', authRoutes);
app.use('/api/poop-records', poopRoutes);

//Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!', 
    env: process.env.NODE_ENV
  });
});

//Test PostgreSQL connection
db.connect()
  .then(client => {
    console.log('✅ Connected to PostgreSQL');
    client.release();
  })
  .catch(err => console.error('❌ PostgreSQL connection failed:', err));

//Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
});