const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'foodstock_db', 
  user: process.env.DB_USER || 'admin',
  password: process.env.DB_PASSWORD || 'password123',
  database: process.env.DB_NAME || 'food_stock',
  port: process.env.DB_PORT || 5432,
});

// FUNCIÓN MODIFICADA CON REINTENTOS AUTOMÁTICOS
const initDb = async () => {
  let conectados = false;
  
  while (!conectados) {
    try {
      console.log("🔄 Intentando conectar y validar tablas en la base de datos...");
      
      // Intentamos un query simple para ver si Postgres ya responde
      await pool.query('SELECT NOW()'); 
      
      // Si llega aquí, es que Postgres ya despertó. Creamos las tablas:
      await pool.query(`
        CREATE TABLE IF NOT EXISTS usuarios (
          id SERIAL PRIMARY KEY,
          username VARCHAR(50) UNIQUE NOT NULL,
          password VARCHAR(100) NOT NULL,
          role VARCHAR(50) NOT NULL
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

      // Validamos e inyectamos los usuarios
      const res = await pool.query("SELECT * FROM usuarios WHERE username = 'admin_comedor'");
      if (res.rows.length === 0) {
        await pool.query("INSERT INTO usuarios (username, password, role) VALUES ('admin_comedor', 'admin123', 'Administrador')");
        await pool.query("INSERT INTO usuarios (username, password, role) VALUES ('voluntario_comedor', 'voluntario123', 'Voluntario')");
        console.log("👥 Usuarios de prueba (Admin y Voluntario) inyectados con éxito.");
      }

      console.log("🚀 [ÉXITO] Base de datos sincronizada y lista para usar.");
      conectados = true; // Rompe el bucle porque todo salió bien
      
    } catch (err) {
      console.log("⏳ Postgres aún no está listo. Reintentando en 5 segundos...");
      // Espera 5 segundos antes de volver a intentar
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
};

module.exports = { pool, initDb };