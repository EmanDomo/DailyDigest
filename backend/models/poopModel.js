import db from '../config/db.js';

const PoopModel = {
  getRecordsByUserId: async (userId) => {
    console.log('Fetching records for user_id:', userId);
    
    const [rows] = await db.execute(
      `SELECT poop_date 
       FROM poop_records 
       WHERE user_id = ? 
       ORDER BY poop_date DESC`,
      [userId]
    );
    
    console.log('Found records:', rows.length);
    return rows.map(row => row.poop_date.toISOString().split('T')[0]);
  },

  createRecord: async (userId, date) => {
    console.log('Creating record for user_id:', userId, 'date:', date);
    
    await db.execute(
      `INSERT INTO poop_records (user_id, poop_date)
       VALUES (?, ?)`,
      [userId, date]
    );
    
    console.log('Record created successfully');
  }
};

export default PoopModel;