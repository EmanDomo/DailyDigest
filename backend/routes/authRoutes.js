import { Router } from 'express';
import { login, logout, getLoggedInUser } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout); // ADD LOGOUT ROUTE

router.get('/user', getLoggedInUser); // ✅ Add this

export default router;