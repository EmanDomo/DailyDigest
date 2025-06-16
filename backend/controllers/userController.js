// import db from '../config/db.js';

// export const getUsers = async (req, res) => {
//   try {
//     const [rows] = await db.query('SELECT * FROM users');
//     res.json(rows);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createUser = async (req, res) => {
//   const { name, email } = req.body;
  
//   try {
//     const [result] = await db.query(
//       'INSERT INTO users (name, email) VALUES (?, ?)',
//       [name, email]
//     );
//     res.status(201).json({ id: result.insertId, name, email });
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };