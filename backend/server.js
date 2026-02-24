require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('crypto').randomUUID ? { v4: () => require('crypto').randomUUID() } : { v4: () => Math.random().toString(36).substr(2, 9) };

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ===== DATA STORAGE (Em memória) =====
let lojas = [
  {
    _id: '1',
    nome: 'MERKATU São José',
    endereco: 'Rua Central, 500 - São José, SC',
    latitude: -28.2245,
    longitude: -48.8295,
    telefone: '(48) 3000-2000',
    ativo: true,
    criadoEm: new Date()
  },
  {
    _id: '2',
    nome: 'MERKATU Florianópolis',
    endereco: 'Rua Vereador Walter Borges, 219 - Florianópolis, SC',
    latitude: -27.5954,
    longitude: -48.5480,
    telefone: '(48) 3000-3000',
    ativo: true,
    criadoEm: new Date()
  },
  {
    _id: '3',
    nome: 'MERKATU Florianópolis Lagoa',
    endereco: 'Avenida Beira Mar, 1500 - Florianópolis, SC',
    latitude: -27.6000,
    longitude: -48.5400,
    telefone: '(48) 3000-4000',
    ativo: true,
    criadoEm: new Date()
  }
];

let estoque = [
  { _id: '1', lojaId: '1', loja: 'MERKATU São José', produto: 'Produto A', quantidade: 150, minimo: 50, ativo: true, criadoEm: new Date() },
  { _id: '2', lojaId: '1', loja: 'MERKATU São José', produto: 'Produto B', quantidade: 30, minimo: 50, ativo: true, criadoEm: new Date() },
  { _id: '3', lojaId: '2', loja: 'MERKATU Florianópolis', produto: 'Produto A', quantidade: 200, minimo: 50, ativo: true, criadoEm: new Date() },
  { _id: '4', lojaId: '2', loja: 'MERKATU Florianópolis', produto: 'Produto C', quantidade: 5, minimo: 20, ativo: true, criadoEm: new Date() },
  { _id: '5', lojaId: '3', loja: 'MERKATU Florianópolis Lagoa', produto: 'Produto B', quantidade: 80, minimo: 50, ativo: true, criadoEm: new Date() }
];

console.log('✓ API em memória inicializada');

// ===== ROTAS DE LOJAS =====

// GET todas as lojas
app.get('/api/lojas', (req, res) => {
  const lojasAtivas = lojas.filter(l => l.ativo);
  res.json(lojasAtivas);
});

// GET loja por ID
app.get('/api/lojas/:id', (req, res) => {
  const loja = lojas.find(l => l._id === req.params.id && l.ativo);
  if (!loja) return res.status(404).json({ erro: 'Loja não encontrada' });
  res.json(loja);
});

// POST nova loja
app.post('/api/lojas', (req, res) => {
  const { nome, endereco, latitude, longitude, telefone } = req.body;
  if (!nome || !endereco || !latitude || !longitude || !telefone) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, endereco, latitude, longitude, telefone' });
  }
  const novaLoja = {
    _id: Math.random().toString(36).substr(2, 9),
    nome,
    endereco,
    latitude: parseFloat(latitude),
    longitude: parseFloat(longitude),
    telefone,
    ativo: true,
    criadoEm: new Date()
  };
  lojas.push(novaLoja);
  res.status(201).json(novaLoja);
});

// PUT atualizar loja
app.put('/api/lojas/:id', (req, res) => {
  const loja = lojas.find(l => l._id === req.params.id);
  if (!loja) return res.status(404).json({ erro: 'Loja não encontrada' });
  
  Object.assign(loja, req.body, { _id: loja._id, criadoEm: loja.criadoEm });
  res.json(loja);
});

// DELETE loja
app.delete('/api/lojas/:id', (req, res) => {
  const loja = lojas.find(l => l._id === req.params.id);
  if (!loja) return res.status(404).json({ erro: 'Loja não encontrada' });
  loja.ativo = false;
  res.json({ mensagem: 'Loja deletada', loja });
});

// ===== ROTAS DE ESTOQUE =====

// GET todo estoque
app.get('/api/estoque', (req, res) => {
  const estoqueAtivo = estoque.filter(e => e.ativo);
  res.json(estoqueAtivo);
});

// GET estoque por loja
app.get('/api/estoque/loja/:lojaId', (req, res) => {
  const estoqueAtivo = estoque.filter(e => e.lojaId === req.params.lojaId && e.ativo);
  res.json(estoqueAtivo);
});

// POST novo item de estoque
app.post('/api/estoque', (req, res) => {
  const { lojaId, loja, produto, quantidade, minimo } = req.body;
  if (!lojaId || !loja || !produto || quantidade === undefined || minimo === undefined) {
    return res.status(400).json({ erro: 'Campos obrigatórios: lojaId, loja, produto, quantidade, minimo' });
  }
  const novoEstoque = {
    _id: Math.random().toString(36).substr(2, 9),
    lojaId,
    loja,
    produto,
    quantidade: parseInt(quantidade),
    minimo: parseInt(minimo),
    ativo: true,
    criadoEm: new Date()
  };
  estoque.push(novoEstoque);
  res.status(201).json(novoEstoque);
});

// PUT atualizar estoque
app.put('/api/estoque/:id', (req, res) => {
  const item = estoque.find(e => e._id === req.params.id);
  if (!item) return res.status(404).json({ erro: 'Item não encontrado' });
  
  Object.assign(item, req.body, { _id: item._id, criadoEm: item.criadoEm });
  res.json(item);
});

// DELETE item estoque
app.delete('/api/estoque/:id', (req, res) => {
  const item = estoque.find(e => e._id === req.params.id);
  if (!item) return res.status(404).json({ erro: 'Item não encontrado' });
  item.ativo = false;
  res.json({ mensagem: 'Item deletado', item });
});

// ===== ROTAS DE SAÚDE =====

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', mensagem: 'API funcionando' });
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`\n🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📦 API disponível em http://localhost:${PORT}/api`);
  console.log(`💚 Dados em memória carregados\n`);
});
