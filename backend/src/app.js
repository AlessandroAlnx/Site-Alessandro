const express = require('express');
const cors = require('cors');
const lojasRoutes = require('./routes/lojas');
const estoqueRoutes = require('./routes/estoque');
const healthRoutes = require('./routes/health');

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/', (req, res) => {
    res.json({
      nome: 'MERKATU Backend',
      status: 'online',
      api: '/api',
      health: '/api/health'
    });
  });

  app.use('/api', healthRoutes);
  app.use('/api/lojas', lojasRoutes);
  app.use('/api/estoque', estoqueRoutes);

  return app;
}

module.exports = { createApp };
