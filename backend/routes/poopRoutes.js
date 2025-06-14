import express from 'express';
import poopController from '../controllers/poopController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, poopController.getPoopRecords);
router.post('/', authenticateToken, poopController.createPoopRecord);

export default router;