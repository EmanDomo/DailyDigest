import PoopModel from '../models/poopModel.js';
import authenticateToken from '../middleware/auth.js';

const poopController = {
  getPoopRecords: async (req, res) => {
    try {
      // USE AUTHENTICATED USER ID FROM req.user
      const userId = req.user.id;
      
      const dates = await PoopModel.getRecordsByUserId(userId);
      res.json({ dates });
    } catch (err) {
      console.error('Error fetching poop records:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createPoopRecord: async (req, res) => {
    try {
      // USE AUTHENTICATED USER ID FROM req.user
      const userId = req.user.id;
      const { date } = req.body;

      await PoopModel.createRecord(userId, date);
      res.json({ success: true });
    } catch (err) {
      console.error('Error creating poop record:', err);

      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Record already exists for this date' });
      }

      res.status(500).json({ message: 'Server error' });
    }
  }
};

export default poopController;