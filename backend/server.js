require('dotenv').config();
const { createApp } = require('./src/app');

const app = createApp();
const PORT = process.env.PORT || 3001;

console.log('✓ API em memória inicializada');

app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📦 API disponível em http://localhost:${PORT}/api`);
  console.log(`💚 Dados em memória carregados\n`);
});
