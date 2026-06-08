const { pool } = require('../config/db');

exports.login = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const result = await pool.query(
      'SELECT * FROM usuarios WHERE username = $1 AND password = $2 AND role = $3',
      [username, password, role]
    );

    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0].username, role: result.rows[0].role });
    } else {
      res.status(401).json({ success: false, message: 'Credenciales inválidas o rol incorrecto' });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};