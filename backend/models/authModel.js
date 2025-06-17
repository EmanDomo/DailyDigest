// import db from '../config/db.js';

// const User = {
//   async findByUsername(username) {
//     try {
//       const [rows] = await db.execute(
//         'SELECT * FROM tbl_users WHERE username = ?',
//         [username]
//       );
//       return rows[0];
//     } catch (error) {
//       console.error('Error finding user by username:', error);
//       throw error;
//     }
//   },

//   async findById(id) {
//     try {
//       const [rows] = await db.execute(
//         'SELECT user_id, name, username, role FROM tbl_users WHERE user_id = ?',
//         [id]
//       );
//       return rows[0];
//     } catch (error) {
//       console.error('Error finding user by ID:', error);
//       throw error;
//     }
//   },

//   async createUser(name, username, hashedPassword) {
//     try {
//       const [result] = await db.execute(
//         'INSERT INTO tbl_users (name, username, password, role) VALUES (?, ?, ?, ?)',
//         [name, username, hashedPassword, 'user']
//       );
      
//       // Return the created user data
//       const [userRows] = await db.execute(
//         'SELECT user_id, name, username, role FROM tbl_users WHERE user_id = ?',
//         [result.insertId]
//       );
      
//       return userRows[0];
//     } catch (error) {
//       console.error('Error creating user:', error);
//       throw error;
//     }
//   }
// };

// export default User;

import db from '../config/db.js'; // Assume this exports a `pg` pool or client

const User = {
  async findByUsername(username) {
    try {
      const { rows } = await db.query(
        'SELECT * FROM tbl_users WHERE username = $1',
        [username]
      );
      return rows[0];
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  },

  async findById(id) {
    try {
      const { rows } = await db.query(
        'SELECT user_id, name, username, role FROM tbl_users WHERE user_id = $1',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  },

  async createUser(name, username, hashedPassword) {
    try {
      const insertQuery = `
        INSERT INTO tbl_users (name, username, password, role)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id
      `;
      const insertResult = await db.query(insertQuery, [name, username, hashedPassword, 'user']);

      const userId = insertResult.rows[0].user_id;

      const { rows: userRows } = await db.query(
        'SELECT user_id, name, username, role FROM tbl_users WHERE user_id = $1',
        [userId]
      );

      return userRows[0];
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
};

export default User;
