import db from '../config/db.js';

const User = {
  async findByUsername(username) {
    const [rows] = await db.query(
      'SELECT * FROM tbl_users WHERE username = ?',
      [username]
    );
    return rows[0];
  }
};

export default User;