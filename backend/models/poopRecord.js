class PoopRecord {
  static async create({ user_id, poop_date }) {
    const [result] = await pool.query(
      'INSERT INTO poop_records (user_id, poop_date) VALUES (?, ?)',
      [user_id, poop_date]
    );
    return { id: result.insertId, user_id, poop_date };
  }

  static async findByUserAndDate(user_id, poop_date) {
    const [rows] = await pool.query(
      'SELECT * FROM poop_records WHERE user_id = ? AND poop_date = ?',
      [user_id, poop_date]
    );
    return rows[0];
  }
  
  // Other methods...
}