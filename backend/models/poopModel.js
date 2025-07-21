// import db from '../config/db.js';

// const PoopModel = {
//   async getRecordsByUserId(userId) {
//     console.log('Fetching records for user_id:', userId);
//     try {
//       const [rows] = await db.execute(
//         `SELECT DATE_FORMAT(poop_date, '%Y-%m-%d') as poop_date 
//          FROM poop_records 
//          WHERE user_id = ? 
//          ORDER BY poop_date DESC`,
//         [userId]
//       );

//       console.log('Found records:', rows.length);
//       return rows.map(row => row.poop_date);
//     } catch (error) {
//       console.error('Error fetching records:', error);
//       throw error;
//     }
//   },

//   async createRecord(userId, date) {
//     console.log('Creating record for user_id:', userId, 'date:', date);

//     const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
//     if (!dateRegex.test(date)) {
//       throw new Error('Invalid date format. Expected YYYY-MM-DD');
//     }

//     try {
//       await db.execute(
//         `INSERT INTO poop_records (user_id, poop_date)
//          VALUES (?, ?)`,
//         [userId, date]
//       );

//       console.log('Record created successfully');
//     } catch (error) {
//       console.error('Error creating record:', error);
//       throw error;
//     }
//   }
// };

// export default PoopModel;

import db from '../config/db.js'; // Assuming you're using the `pg` client or pool

const PoopModel = {
  async getRecordsByUserId(userId) {
    console.log('Fetching records for user_id:', userId);
    try {
      const result = await db.query(
        `SELECT TO_CHAR(poop_date, 'YYYY-MM-DD') AS poop_date
         FROM poop_records
         WHERE user_id = $1
         ORDER BY poop_date DESC`,
        [userId]
      );

      console.log('Found records:', result.rows.length);
      return result.rows.map(row => row.poop_date);
    } catch (error) {
      console.error('Error fetching records:', error);
      throw error;
    }
  },

  async createRecord(userId, date) {
    console.log('Creating record for user_id:', userId, 'date:', date);

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }

    try {
      await db.query(
        `INSERT INTO poop_records (user_id, poop_date)
         VALUES ($1, $2)`,
        [userId, date]
      );

      console.log('Record created successfully');
    } catch (error) {
      console.error('Error creating record:', error);
      throw error;
    }
  },

  async deleteRecord(userId, date) {
    console.log('Deleting record for user_id:', userId, 'date:', date);

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new Error('Invalid date format. Expected YYYY-MM-DD');
    }

    try {
      await db.query(
        `DELETE FROM poop_records
         WHERE user_id = $1 AND poop_date = $2`,
        [userId, date]
      );

      console.log('Record deleted successfully');
    } catch (error) {
      console.error('Error deleting record:', error);
      throw error;
    }
}
};

export default PoopModel;

