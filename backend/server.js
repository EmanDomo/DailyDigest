import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import poopRoutes from './routes/poopRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/poop-records', poopRoutes);

// Database connection
db.getConnection()
  .then(() => console.log('Connected to MySQL'))
  .catch(err => console.error('Connection failed:', err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Add this right after dotenv.config() in your server.js
dotenv.config();

// DEBUG: Check environment variables
console.log('🔧 SERVER DEBUG:');
console.log('JWT_SECRET loaded:', !!process.env.JWT_SECRET);
console.log('JWT_SECRET length:', process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0);
console.log('PORT:', process.env.PORT);


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
