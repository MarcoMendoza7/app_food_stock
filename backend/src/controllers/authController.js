const { pool } = require('../config/db');

// --- LOGIN DE USUARIOS ---
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

// --- REGISTRO DE NUEVOS USUARIOS (ADMIN O VOLUNTARIO) ---
exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  
  if (!username || !password || !role) {
    return res.status(400).json({ success: false, message: 'Todos los campos son obligatorios' });
  }

  try {
    // Validar si el usuario ya existe en la base de datos distribuida
    const userCheck = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
    
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: 'El nombre de usuario ya está en uso' });
    }

    // Insertar el nuevo registro persistente
    await pool.query(
      'INSERT INTO usuarios (username, password, role) VALUES ($1, $2, $3)',
      [username, password, role]
    );

    res.status(201).json({ success: true, message: 'Cuenta creada exitosamente' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};