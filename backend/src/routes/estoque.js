const express = require('express');
const {
  getActiveEstoque,
  getEstoqueByLojaId,
  createEstoque,
  updateEstoque,
  deleteEstoque
} = require('../data/memory-store');

const router = express.Router();

router.get('/', (req, res) => {
  res.json(getActiveEstoque());
});

router.get('/loja/:lojaId', (req, res) => {
  res.json(getEstoqueByLojaId(req.params.lojaId));
});

router.post('/', (req, res) => {
  const { lojaId, loja, produto, quantidade, minimo } = req.body;
  if (!lojaId || !loja || !produto || quantidade === undefined || minimo === undefined) {
    return res.status(400).json({ erro: 'Campos obrigatórios: lojaId, loja, produto, quantidade, minimo' });
  }

  return res.status(201).json(createEstoque(req.body));
});

router.put('/:id', (req, res) => {
  const item = updateEstoque(req.params.id, req.body);
  if (!item) {
    return res.status(404).json({ erro: 'Item não encontrado' });
  }

  return res.json(item);
});

router.delete('/:id', (req, res) => {
  const item = deleteEstoque(req.params.id);
  if (!item) {
    return res.status(404).json({ erro: 'Item não encontrado' });
  }

  return res.json({ mensagem: 'Item deletado', item });
});

module.exports = router;
