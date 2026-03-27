const crypto = require('crypto');

function generateId() {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return Math.random().toString(36).slice(2, 11);
}

const lojas = [
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
    longitude: -48.548,
    telefone: '(48) 3000-3000',
    ativo: true,
    criadoEm: new Date()
  },
  {
    _id: '3',
    nome: 'MERKATU Florianópolis Lagoa',
    endereco: 'Avenida Beira Mar, 1500 - Florianópolis, SC',
    latitude: -27.6,
    longitude: -48.54,
    telefone: '(48) 3000-4000',
    ativo: true,
    criadoEm: new Date()
  }
];

const estoque = [
  { _id: '1', lojaId: '1', loja: 'MERKATU São José', produto: 'Produto A', quantidade: 150, minimo: 50, ativo: true, criadoEm: new Date() },
  { _id: '2', lojaId: '1', loja: 'MERKATU São José', produto: 'Produto B', quantidade: 30, minimo: 50, ativo: true, criadoEm: new Date() },
  { _id: '3', lojaId: '2', loja: 'MERKATU Florianópolis', produto: 'Produto A', quantidade: 200, minimo: 50, ativo: true, criadoEm: new Date() },
  { _id: '4', lojaId: '2', loja: 'MERKATU Florianópolis', produto: 'Produto C', quantidade: 5, minimo: 20, ativo: true, criadoEm: new Date() },
  { _id: '5', lojaId: '3', loja: 'MERKATU Florianópolis Lagoa', produto: 'Produto B', quantidade: 80, minimo: 50, ativo: true, criadoEm: new Date() }
];

function getActiveLojas() {
  return lojas.filter((loja) => loja.ativo);
}

function getLojaById(id) {
  return lojas.find((loja) => loja._id === id && loja.ativo);
}

function createLoja(payload) {
  const loja = {
    _id: generateId(),
    nome: payload.nome,
    endereco: payload.endereco,
    latitude: Number.parseFloat(payload.latitude),
    longitude: Number.parseFloat(payload.longitude),
    telefone: payload.telefone,
    ativo: true,
    criadoEm: new Date()
  };

  lojas.push(loja);
  return loja;
}

function updateLoja(id, payload) {
  const loja = lojas.find((item) => item._id === id);
  if (!loja) {
    return null;
  }

  Object.assign(loja, payload, { _id: loja._id, criadoEm: loja.criadoEm });
  return loja;
}

function deleteLoja(id) {
  const loja = lojas.find((item) => item._id === id);
  if (!loja) {
    return null;
  }

  loja.ativo = false;
  return loja;
}

function getActiveEstoque() {
  return estoque.filter((item) => item.ativo);
}

function getEstoqueByLojaId(lojaId) {
  return estoque.filter((item) => item.lojaId === lojaId && item.ativo);
}

function createEstoque(payload) {
  const item = {
    _id: generateId(),
    lojaId: payload.lojaId,
    loja: payload.loja,
    produto: payload.produto,
    quantidade: Number.parseInt(payload.quantidade, 10),
    minimo: Number.parseInt(payload.minimo, 10),
    ativo: true,
    criadoEm: new Date()
  };

  estoque.push(item);
  return item;
}

function updateEstoque(id, payload) {
  const item = estoque.find((entry) => entry._id === id);
  if (!item) {
    return null;
  }

  Object.assign(item, payload, { _id: item._id, criadoEm: item.criadoEm });
  return item;
}

function deleteEstoque(id) {
  const item = estoque.find((entry) => entry._id === id);
  if (!item) {
    return null;
  }

  item.ativo = false;
  return item;
}

module.exports = {
  getActiveLojas,
  getLojaById,
  createLoja,
  updateLoja,
  deleteLoja,
  getActiveEstoque,
  getEstoqueByLojaId,
  createEstoque,
  updateEstoque,
  deleteEstoque
};
