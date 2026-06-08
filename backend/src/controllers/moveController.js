const { pool } = require('../config/db');

exports.getAll = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movimientos ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.create = async (req, res) => {
  const { tipo, producto, cantidad } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO movimientos (tipo, producto, cantidad) VALUES ($1, $2, $3) RETURNING *',
      [tipo, producto, cantidad]
    );
    
    if (tipo === 'entrada') {
      await pool.query('UPDATE alimentos SET cantidad = cantidad + $1 WHERE nombre = $2', [cantidad, producto]);
    } else if (tipo === 'salida') {
      await pool.query('UPDATE alimentos SET cantidad = GREATEST(0, cantidad - $1) WHERE nombre = $2', [cantidad, producto]);
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};