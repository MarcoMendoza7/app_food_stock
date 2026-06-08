const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres_db',
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'food_stock',
  port: process.env.DB_PORT || 5432,
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS alimentos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        cantidad INTEGER NOT NULL DEFAULT 0,
        categoria VARCHAR(50) NOT NULL,
        caducidad DATE NOT NULL
      );

      CREATE TABLE IF NOT EXISTS movimientos (
        id SERIAL PRIMARY KEY,
        tipo VARCHAR(20) NOT NULL,
        producto VARCHAR(100) NOT NULL,
        cantidad INTEGER NOT NULL,
        fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    const res = await pool.query("SELECT * FROM usuarios WHERE username = 'admin_comedor'");
    if (res.rows.length === 0) {
      await pool.query("INSERT INTO usuarios (username, password, role) VALUES ('admin_comedor', 'admin123', 'Administrador')");
      await pool.query("INSERT INTO usuarios (username, password, role) VALUES ('voluntario1', 'voluntario123', 'Voluntario')");
    }
  } catch (err) {
    console.error("Error inicializando la base de datos:", err);
  }
};

module.exports = { pool, initDb };