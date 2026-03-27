export const fallbackStores = [
  {
    id: '1',
    nome: 'MERKATU São José',
    endereco: 'Rua Central, 500 - São José, SC',
    latitude: -28.2245,
    longitude: -48.8295,
    telefone: '(48) 3000-2000'
  },
  {
    id: '2',
    nome: 'MERKATU Florianópolis',
    endereco: 'Rua Vereador Walter Borges, 219 - Florianópolis, SC',
    latitude: -27.5954,
    longitude: -48.548,
    telefone: '(48) 3000-3000'
  },
  {
    id: '3',
    nome: 'MERKATU Florianópolis Lagoa',
    endereco: 'Avenida Beira Mar, 1500 - Florianópolis, SC',
    latitude: -27.6,
    longitude: -48.54,
    telefone: '(48) 3000-4000'
  }
];

export const fallbackInventory = [
  { id: '1', lojaId: '1', loja: 'MERKATU São José', produto: 'Produto A', quantidade: 150, minimo: 50 },
  { id: '2', lojaId: '1', loja: 'MERKATU São José', produto: 'Produto B', quantidade: 30, minimo: 50 },
  { id: '3', lojaId: '2', loja: 'MERKATU Florianópolis', produto: 'Produto A', quantidade: 200, minimo: 50 },
  { id: '4', lojaId: '2', loja: 'MERKATU Florianópolis', produto: 'Produto C', quantidade: 5, minimo: 20 },
  { id: '5', lojaId: '3', loja: 'MERKATU Florianópolis Lagoa', produto: 'Produto B', quantidade: 80, minimo: 50 }
];
