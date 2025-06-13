import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'; // ADD THIS
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import poopRoutes from './routes/poopRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true // IMPORTANT: This must be true for cookies to work
}));
app.use(express.json());
app.use(cookieParser()); // ADD THIS MIDDLEWARE

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/poop-records', poopRoutes);

// Database connection
db.getConnection()
  .then(() => console.log('Connected to MySQL'))
  .catch(err => console.error('Connection failed:', err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import db from './config/db.js';
// import authRoutes from './routes/authRoutes.js';

// dotenv.config();
// const app = express();

// // Middleware
// app.use(cors({
//   origin: 'http://localhost:5173', // Vite default port
//   credentials: true
// }));
// app.use(express.json());

// // Routes
// app.use('/api/auth', authRoutes);

// // Test database connection
// db.query('SELECT NOW()')
//   .then(() => console.log('✅ Connected to Neon PostgreSQL'))
//   .catch(err => console.error('❌ Failed to connect to Neon DB:', err));

// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
