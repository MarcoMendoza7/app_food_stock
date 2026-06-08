const { pool } = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nombre, cantidad, categoria, TO_CHAR(caducidad, \'YYYY-MM-DD\') as caducidad FROM alimentos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { nombre, cantidad, categoria, caducidad } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO alimentos (nombre, cantidad, categoria, caducidad) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, cantidad, categoria, caducidad]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { id } = req.params;
  const { nombre, cantidad, categoria, caducidad } = req.body;
  try {
    const result = await pool.query(
      'UPDATE alimentos SET nombre = $1, cantidad = $2, categoria = $3, caducidad = $4 WHERE id = $5 RETURNING *',
      [nombre, cantidad, categoria, caducidad, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM alimentos WHERE id = $1', [id]);
    res.json({ message: 'Alimento eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};