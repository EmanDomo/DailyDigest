import express from 'express';
import poopController from '../controllers/poopController.js';

const router = express.Router();


router.get('/', poopController.getPoopRecords);
router.post('/', poopController.createPoopRecord);

export default router;