import express from 'express';
import poopController from '../controllers/poopController.js';
import authenticateToken from '../middleware/auth.js';

const router = express.Router();

router.get('/get-records', authenticateToken, poopController.getPoopRecords);
router.post('/create-record', authenticateToken, poopController.createPoopRecord);
router.delete('/delete-record', authenticateToken, poopController.deletePoopRecord);

export default router;
 