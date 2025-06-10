import db from '../config/db.js';

const User = {
  async findByUsername(username) {
    const result = await db.query(
      'SELECT * FROM tbl_users WHERE username = $1',
      [username]
    );
    return rows[0];
  }
};

export default User;