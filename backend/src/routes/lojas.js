const express = require('express');
const {
  getActiveLojas,
  getLojaById,
  createLoja,
  updateLoja,
  deleteLoja
} = require('../data/memory-store');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(getActiveLojas());
});

router.get('/:id', (req, res) => {
  const loja = getLojaById(req.params.id);
  if (!loja) {
    return res.status(404).json({ erro: 'Loja não encontrada' });
  }

  return res.json(loja);
});

router.post('/', (req, res) => {
  const { nome, endereco, latitude, longitude, telefone } = req.body;
  if (!nome || !endereco || !latitude || !longitude || !telefone) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, endereco, latitude, longitude, telefone' });
  }

  return res.status(201).json(createLoja(req.body));
});

router.put('/:id', (req, res) => {
  const loja = updateLoja(req.params.id, req.body);
  if (!loja) {
    return res.status(404).json({ erro: 'Loja não encontrada' });
  }

  return res.json(loja);
});

router.delete('/:id', (req, res) => {
  const loja = deleteLoja(req.params.id);
  if (!loja) {
    return res.status(404).json({ erro: 'Loja não encontrada' });
  }

  return res.json({ mensagem: 'Loja deletada', loja });
});

module.exports = router;
