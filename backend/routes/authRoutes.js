import { Router } from 'express';
import { login, logout, getLoggedInUser } from '../controllers/authController.js';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/user', getLoggedInUser);

export default router;