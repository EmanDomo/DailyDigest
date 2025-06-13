import db from '../config/db.js';

const User = {
  async findByUsername(username) {
    try {
      const [rows] = await db.execute(
        'SELECT * FROM tbl_users WHERE username = ?',
        [username]
      );
      return rows[0];
    } catch (error) {
      console.error('Error finding user by username:', error);
      throw error;
    }
  },

  // ✅ Add this for /me route
  async findById(id) {
    try {
      const [rows] = await db.execute(
        'SELECT user_id, name, username, role FROM tbl_users WHERE user_id = ?',
        [id]
      );
      return rows[0];
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }
};

export default User;

