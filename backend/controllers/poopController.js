import PoopModel from '../models/poopModel.js';

const poopController = {
  getPoopRecords: async (req, res) => {
    try {
      // Option 1: Use a default user ID (e.g., 1) for testing
      const userId = 1; // Hardcoded for now
      
      // Option 2: Get all records regardless of user
      // const dates = await PoopModel.getAllRecords();
      
      const dates = await PoopModel.getRecordsByUserId(userId);
      res.json({ dates });
    } catch (err) {
      console.error('Error fetching poop records:', err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createPoopRecord: async (req, res) => {
    try {
      // Option 1: Use a default user ID (e.g., 1) for testing
      const userId = 1; // Hardcoded for now
      
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