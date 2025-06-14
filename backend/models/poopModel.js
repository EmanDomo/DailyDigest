import db from '../config/db.js';

const PoopModel = {
  getRecordsByUserId: async (userId) => {
    console.log('Fetching records for user_id:', userId);
    
    const [rows] = await db.execute(
      `SELECT DATE_FORMAT(poop_date, '%Y-%m-%d') as poop_date 
       FROM poop_records 
       WHERE user_id = ? 
       ORDER BY poop_date DESC`,
      [userId]
    );
    
    console.log('Found records:', rows.length);
    console.log('Raw records:', rows); // Debug log
    
    // Since we're using DATE_FORMAT, the poop_date is already a string in YYYY-MM-DD format
    return rows.map(row => row.poop_date);
  },

  createRecord: async (userId, date) => {
    console.log('Creating record for user_id:', userId, 'date:', date);
    
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }
    
    await db.execute(
      `INSERT INTO poop_records (user_id, poop_date)
       VALUES (?, ?)`,
      [userId, date]
    );
    
    console.log('Record created successfully');
  }
};

export default PoopModel;