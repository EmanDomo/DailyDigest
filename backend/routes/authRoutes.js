import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/user', authController.getLoggedInUser);
router.post('/register', authController.createUser);

export default router;
