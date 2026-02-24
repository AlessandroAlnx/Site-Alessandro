const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== DADOS EM MEMÓRIA ==================== 
let stores = [
    {
        id: uuidv4(),
        nome: 'MERKATU Centro',
        endereco: 'Rua Principal, 123',
        latitude: -23.5505,
        longitude: -46.6333,
        telefone: '(11) 3000-1000',
        estoque: 450,
        criadoEm: new Date()
    },
    {
        id: uuidv4(),
        nome: 'MERKATU Zona Sul',
        endereco: 'Av. Paulista, 1000',
        latitude: -23.5613,
        longitude: -46.6560,
        telefone: '(11) 3000-2000',
        estoque: 320,
        criadoEm: new Date()
    },
    {
        id: uuidv4(),
        nome: 'MERKATU Zona Norte',
        endereco: 'Rua do Comércio, 500',
        latitude: -23.5380,
        longitude: -46.5160,
        telefone: '(11) 3000-3000',
        estoque: 280,
        criadoEm: new Date()
    }
];

let estoque = [
    { 
        id: uuidv4(), 
        loja: 'MERKATU Centro', 
        produto: 'Produto A', 
        quantidade: 150, 
        minimo: 50, 
        preco: 29.99,
        sku: 'SKU001',
        descricao: 'Descrição do Produto A'
    },
    { 
        id: uuidv4(), 
        loja: 'MERKATU Centro', 
        produto: 'Produto B', 
        quantidade: 30, 
        minimo: 50, 
        preco: 49.99,
        sku: 'SKU002',
        descricao: 'Descrição do Produto B'
    },
    { 
        id: uuidv4(), 
        loja: 'MERKATU Zona Sul', 
        produto: 'Produto A', 
        quantidade: 200, 
        minimo: 50, 
        preco: 29.99,
        sku: 'SKU001',
        descricao: 'Descrição do Produto A'
    },
    { 
        id: uuidv4(), 
        loja: 'MERKATU Zona Sul', 
        produto: 'Produto C', 
        quantidade: 5, 
        minimo: 20, 
        preco: 99.99,
        sku: 'SKU003',
        descricao: 'Descrição do Produto C'
    },
    { 
        id: uuidv4(), 
        loja: 'MERKATU Zona Norte', 
        produto: 'Produto B', 
        quantidade: 80, 
        minimo: 50, 
        preco: 49.99,
        sku: 'SKU002',
        descricao: 'Descrição do Produto B'
    }
];

// ==================== ROTAS DE LOJAS ==================== 

// GET - Todas as lojas
app.get('/api/lojas', (req, res) => {
    res.json(stores);
});

// GET - Loja por ID
app.get('/api/lojas/:id', (req, res) => {
    const store = stores.find(s => s.id === req.params.id);
    if (!store) {
        return res.status(404).json({ erro: 'Loja não encontrada' });
    }
    res.json(store);
});

// POST - Criar nova loja
app.post('/api/lojas', (req, res) => {
    const { nome, endereco, latitude, longitude, telefone } = req.body;

    if (!nome || !endereco || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ erro: 'Dados incompletos' });
    }

    const novaLoja = {
        id: uuidv4(),
        nome,
        endereco,
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        telefone: telefone || '',
        estoque: 0,
        criadoEm: new Date()
    };

    stores.push(novaLoja);
    res.status(201).json(novaLoja);
});

// PUT - Atualizar loja
app.put('/api/lojas/:id', (req, res) => {
    const store = stores.find(s => s.id === req.params.id);
    if (!store) {
        return res.status(404).json({ erro: 'Loja não encontrada' });
    }

    const { nome, endereco, latitude, longitude, telefone } = req.body;
    if (nome) store.nome = nome;
    if (endereco) store.endereco = endereco;
    if (latitude !== undefined) store.latitude = parseFloat(latitude);
    if (longitude !== undefined) store.longitude = parseFloat(longitude);
    if (telefone !== undefined) store.telefone = telefone;

    res.json(store);
});

// DELETE - Deletar loja
app.delete('/api/lojas/:id', (req, res) => {
    const index = stores.findIndex(s => s.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ erro: 'Loja não encontrada' });
    }

    const lojaDeletada = stores.splice(index, 1);
    res.json({ mensagem: 'Loja deletada com sucesso', loja: lojaDeletada });
});

// ==================== ROTAS DE ESTOQUE ==================== 

// GET - Todo o estoque
app.get('/api/estoque', (req, res) => {
    res.json(estoque);
});

// GET - Estoque por loja
app.get('/api/estoque/loja/:loja', (req, res) => {
    const items = estoque.filter(e => e.loja === decodeURIComponent(req.params.loja));
    res.json(items);
});

// GET - Estoque por produto
app.get('/api/estoque/produto/:produto', (req, res) => {
    const items = estoque.filter(e => e.produto === decodeURIComponent(req.params.produto));
    res.json(items);
});

// POST - Adicionar item ao estoque
app.post('/api/estoque', (req, res) => {
    const { loja, produto, quantidade, minimo, preco, sku, descricao } = req.body;

    if (!loja || !produto || quantidade === undefined) {
        return res.status(400).json({ erro: 'Dados incompletos' });
    }

    const novoItem = {
        id: uuidv4(),
        loja,
        produto,
        quantidade: parseInt(quantidade),
        minimo: parseInt(minimo) || 0,
        preco: parseFloat(preco) || 0,
        sku: sku || '',
        descricao: descricao || '',
        atualizadoEm: new Date()
    };

    estoque.push(novoItem);
    res.status(201).json(novoItem);
});

// PUT - Atualizar estoque
app.put('/api/estoque/:id', (req, res) => {
    const item = estoque.find(e => e.id === req.params.id);
    if (!item) {
        return res.status(404).json({ erro: 'Item não encontrado' });
    }

    const { quantidade, minimo, preco, descricao } = req.body;
    if (quantidade !== undefined) item.quantidade = parseInt(quantidade);
    if (minimo !== undefined) item.minimo = parseInt(minimo);
    if (preco !== undefined) item.preco = parseFloat(preco);
    if (descricao !== undefined) item.descricao = descricao;
    item.atualizadoEm = new Date();

    res.json(item);
});

// DELETE - Deletar item do estoque
app.delete('/api/estoque/:id', (req, res) => {
    const index = estoque.findIndex(e => e.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ erro: 'Item não encontrado' });
    }

    const itemDeletado = estoque.splice(index, 1);
    res.json({ mensagem: 'Item deletado com sucesso', item: itemDeletado });
});

// ==================== ROTAS DE ANALYTICS ==================== 

// GET - Estatísticas gerais
app.get('/api/analytics', (req, res) => {
    const totalLoja = estoque.reduce((sum, e) => sum + (e.quantidade * e.preco), 0);
    const produtosBaixoEstoque = estoque.filter(e => e.quantidade <= e.minimo).length;

    res.json({
        totalLojas: stores.length,
        totalProdutos: estoque.length,
        produtosBaixoEstoque,
        valorTotalEstoque: totalLoja.toFixed(2)
    });
});

// ==================== ROTA DE GEOLOCALIZAÇÃO ==================== 

// GET - Encontrar loja mais próxima
app.get('/api/lojas/proxima/:lat/:lng', (req, res) => {
    const { lat, lng } = req.params;
    const userLat = parseFloat(lat);
    const userLng = parseFloat(lng);

    if (isNaN(userLat) || isNaN(userLng)) {
        return res.status(400).json({ erro: 'Coordenadas inválidas' });
    }

    const proximaLoja = stores.reduce((prev, curr) => {
        const distPrev = Math.sqrt(
            Math.pow(prev.latitude - userLat, 2) + Math.pow(prev.longitude - userLng, 2)
        );
        const distCurr = Math.sqrt(
            Math.pow(curr.latitude - userLat, 2) + Math.pow(curr.longitude - userLng, 2)
        );
        return distCurr < distPrev ? curr : prev;
    });

    res.json(proximaLoja);
});

// ==================== HEALTH CHECK ==================== 

app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK',
        timestamp: new Date(),
        lojas: stores.length,
        productsEmEstoque: estoque.length
    });
});

// ==================== INICIALIZAÇÃO ==================== 

app.listen(PORT, () => {
    console.log(`\n🚀 API MERKATU rodando em http://localhost:${PORT}`);
    console.log(`📍 Endpoints disponíveis:`);
    console.log(`   GET  /api/lojas`);
    console.log(`   POST /api/lojas`);
    console.log(`   GET  /api/estoque`);
    console.log(`   POST /api/estoque`);
    console.log(`   GET  /api/analytics`);
    console.log(`   GET  /api/health\n`);
});
