const express = require('express');
const { initDb } = require('./src/config/db');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'OK', node: process.env.CONTAINER_NAME || 'Unknown Node' });
});

app.use('/', apiRoutes);

initDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Instancia de la API corriendo en el puerto ${PORT}`);
  });
});