import './styles/main.css';

console.log('✓ Main.js carregado');

const API_URL = 'http://localhost:3001/api';
let stores = [];
let estoque = [];

// Pages
const templates = {
  home: () => `
    <section class="hero">
      <h1><span class="logo-inline"><span class="m outer">M</span><span class="m inner">M</span></span> MERKATU</h1>
      <p>Plataforma de Lojas Online</p>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button class="btn btn-primary" onclick="window.navigateTo('/lojas')">Ver Lojas</button>
        <button class="btn btn-secondary" onclick="window.navigateTo('/admin')">Admin</button>
      </div>
    </section>
  `,
  mapa: () => `
    <div style="display: flex; flex-direction: column; gap: 12px;">
      <div>
        <h1 style="margin-bottom: 8px; color: var(--neon);">🗺️ Mapa de Lojas</h1>
        <p style="color: var(--text); font-size: 1.05em;">Encontre todas as nossas lojas no mapa interativo</p>
      </div>
      <div id="mapContainer"></div>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button class="btn btn-primary" onclick="window.getUserLocation()">📍 Minha Localização</button>
        <button class="btn btn-secondary" id="mapModeBtn" onclick="window.setMapClickMode()">➕ Adicionar Loja</button>
        <button class="btn btn-danger" id="discardBtn" style="display: none;" onclick="window.discardMarker()">🗑️ Descartar Marcador</button>
        <button class="btn btn-secondary" onclick="window.navigateTo('/admin')">⚙️ Admin</button>
        <button class="btn btn-secondary" onclick="window.navigateTo('/')">◄ Voltar</button>
      </div>
      <div id="mapClickInfo" style="display: none; padding: 15px; background: linear-gradient(135deg, rgba(57,255,20,0.05), rgba(57,255,20,0.02)); border-left: 3px solid var(--neon); border-radius: 6px; margin-top: 10px; color: var(--text);">
        <strong style="color: var(--neon);">Modo de adição ativo:</strong> Clique no mapa para marcar o local da nova loja. Você poderá adicionar o nome e detalhes no próximo passo.
      </div>
    </div>
  `,
  lojas: () => `
    <div>
      <div style="margin-bottom: 30px;">
        <h1 style="color: var(--neon); margin-bottom: 8px;">Nossas Lojas</h1>
        <p style="color: var(--text); margin-bottom: 20px;">Busque por nome de loja para encontrar perto de você</p>
        <input type="text" id="searchStores" class="search-input" placeholder="🔍 Buscar loja por nome...">
      </div>
      <div id="storesList" class="stores-grid"></div>
      <button class="btn btn-secondary" style="margin-top: 20px;" onclick="window.navigateTo('/')">◄ Voltar</button>
    </div>
  `,
  estoque: () => `
    <div class="estoque-header">
      <h1>📦 Gerenciador de Estoque</h1>
      <div class="estoque-filters">
        <select id="storeFilter" class="filter-select">
          <option value="">Todas as Lojas</option>
        </select>
        <input type="text" id="productSearch" class="search-input" placeholder="🔍 Buscar produto...">
      </div>
    </div>

    <div class="estoque-content">
      <div class="estoque-table-container">
        <table id="estoqueTable" class="estoque-table">
          <thead>
            <tr>
              <th>Loja</th>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Estoque Mín.</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="estoqueBody">
          </tbody>
        </table>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <button class="btn btn-secondary" onclick="window.navigateTo('/admin')">⚙️ Admin</button>
      <button class="btn btn-secondary" onclick="window.navigateTo('/')">◄ Voltar</button>
    </div>
  `,
  admin: () => `
    <h1>Painel Admin</h1>
    <div style="display: flex; gap: 10px; margin: 20px 0;">
      <button class="tab-btn active" data-tab="lojas">Lojas</button>
      <button class="tab-btn" data-tab="estoque">Estoque</button>
      <button class="tab-btn" data-tab="info">Info</button>
    </div>
    <div>
      <section id="lojas-tab" class="tab-content active">
        <button class="btn btn-primary" onclick="window.openStoreForm()">+ Loja</button>
        <table class="admin-table">
          <thead><tr><th>Nome</th><th>Endereco</th><th>Acao</th></tr></thead>
          <tbody id="storesAdminBody"></tbody>
        </table>
      </section>
      <section id="estoque-tab" class="tab-content">
        <table class="admin-table">
          <thead><tr><th>Loja</th><th>Produto</th><th>Qtd</th></tr></thead>
          <tbody id="estoqueAdminBody"></tbody>
        </table>
      </section>
      <section id="info-tab" class="tab-content">
        <p>Lojas: <strong id="totalStores">0</strong></p>
        <p>Produtos: <strong id="totalProducts">0</strong></p>
        <p>Baixo: <strong id="lowStockCount">0</strong></p>
      </section>
    </div>
    <div id="storeModal" class="modal">
      <div class="modal-content">
        <h2>+ Loja</h2>
        <form id="storeForm" style="display: flex; flex-direction: column; gap: 10px;">
          <input type="text" placeholder="Nome" id="storeName" required>
          <input type="text" placeholder="Endereco" id="storeAddress" required>
          <input type="number" placeholder="Lat" id="storeLat" step="0.000001" required>
          <input type="number" placeholder="Lng" id="storeLng" step="0.000001" required>
          <input type="text" placeholder="Tel" id="storePhone" required>
          <div style="display: flex; gap: 10px;">
            <button type="button" class="btn btn-secondary" onclick="window.closeStoreForm()">Cancelar</button>
            <button type="submit" class="btn btn-primary">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  `
};

window.navigateTo = function(path) {
  console.log('→ Navegar para:', path);
  const app = document.getElementById('app');
  if (!app) {
    console.error('❌ #app não encontrado');
    return;
  }
  
  const key = path === '/' ? 'home' : path.slice(1);
  const html = templates[key] ? templates[key]() : templates.home();
  app.innerHTML = html;
  
  // Setup
  setTimeout(() => {
    if (path === '/lojas') loadStoresPage();
    if (path === '/estoque') loadEstoquePage();
    if (path === '/admin') loadAdminPage();
    if (path === '/mapa') loadMapPage();
  }, 10);
};

// ===== LOJAS PAGE =====
async function loadStoresPage() {
  console.log('📍 Loading lojas...');
  try {
    stores = await fetch(`${API_URL}/lojas`).then(r => r.json());
  } catch (e) {
    console.log('⚠ API indisponível');
    stores = [
      {id: '1', nome: 'MERKATU Centro', endereco: 'Rua Principal, 123', telefone: '(11) 3000-1000'},
      {id: '2', nome: 'MERKATU Zona Sul', endereco: 'Av. Paulista, 1000', telefone: '(11) 3000-2000'},
      {id: '3', nome: 'MERKATU Zona Norte', endereco: 'Rua do Comercio, 500', telefone: '(11) 3000-3000'},
      {id: '4', nome: 'MERKATU Florianópolis', endereco: 'Rua Vereador Walter Borges, 219 - Campinas, CEP 88101030', telefone: '(48) 3000-4000'}
    ];
  }
  
  renderStoresList(stores);
  
  const search = document.getElementById('searchStores');
  if (search) {
    search.addEventListener('keyup', (e) => {
      const filtered = stores.filter(s => s.nome.toLowerCase().includes(e.target.value.toLowerCase()));
      renderStoresList(filtered);
    });
  }
}

function renderStoresList(data) {
  const list = document.getElementById('storesList');
  if (!list) return;
  list.innerHTML = data.map(s => `
    <div class="store-card">
      <h3><span class="logo-inline"><span class="m outer">M</span><span class="m inner">M</span></span> ${s.nome}</h3>
      <p>${s.endereco}</p>
      <p>📞 ${s.telefone}</p>
    </div>
  `).join('');
}

// ===== ESTOQUE PAGE =====
async function loadEstoquePage() {
  console.log('📦 Loading estoque...');
  try {
    estoque = await fetch(`${API_URL}/estoque`).then(r => r.json());
  } catch {
    estoque = [
      {id: '1', loja: 'MERKATU Centro', produto: 'Produto A', quantidade: 150, minimo: 50},
      {id: '2', loja: 'MERKATU Centro', produto: 'Produto B', quantidade: 30, minimo: 50},
      {id: '3', loja: 'MERKATU Zona Sul', produto: 'Produto A', quantidade: 200, minimo: 50},
      {id: '4', loja: 'MERKATU Zona Sul', produto: 'Produto C', quantidade: 5, minimo: 20},
      {id: '5', loja: 'MERKATU Zona Norte', produto: 'Produto B', quantidade: 80, minimo: 50}
    ];
  }
  
  setupEstoqueFilters();
  renderEstoqueTable(estoque);
}

function setupEstoqueFilters() {
  const lojas = [...new Set(estoque.map(e => e.loja))];
  const select = document.getElementById('storeFilter');
  if (select) {
    select.innerHTML = '<option value="">Todas</option>' + lojas.map(l => `<option value="${l}">${l}</option>`).join('');
    select.addEventListener('change', applyEstoqueFilters);
  }
  
  const search = document.getElementById('productSearch');
  if (search) search.addEventListener('keyup', applyEstoqueFilters);
}

function applyEstoqueFilters() {
  const store = document.getElementById('storeFilter')?.value || '';
  const product = document.getElementById('productSearch')?.value.toLowerCase() || '';
  
  const filtered = estoque.filter(e => 
    (!store || e.loja === store) && 
    (!product || e.produto.toLowerCase().includes(product))
  );
  
  renderEstoqueTable(filtered);
}

function renderEstoqueTable(data) {
  const tbody = document.getElementById('estoqueBody');
  if (!tbody) return;
  
  tbody.innerHTML = data.map(item => {
    const status = item.quantidade === 0 ? 'critical' : 
                   item.quantidade <= item.minimo ? 'low' : 'ok';
    const text = status === 'critical' ? '❌ Vazio' : status === 'low' ? '⚠ Baixo' : '✓ OK';
    return `
      <tr>
        <td>${item.loja}</td>
        <td>${item.produto}</td>
        <td>${item.quantidade}</td>
        <td>${item.minimo}</td>
        <td><span class="status-badge status-${status}">${text}</span></td>
      </tr>
    `;
  }).join('');
}

// ===== ADMIN PAGE =====
async function loadAdminPage() {
  console.log('⚙ Loading admin...');
  
  try {
    stores = await fetch(`${API_URL}/lojas`).then(r => r.json());
  } catch {
    stores = [
      {id: '1', nome: 'MERKATU Centro', endereco: 'Rua Principal, 123', latitude: -23.5505, longitude: -46.6333},
      {id: '2', nome: 'MERKATU Zona Sul', endereco: 'Av. Paulista, 1000', latitude: -23.5613, longitude: -46.6560},
      {id: '3', nome: 'MERKATU Zona Norte', endereco: 'Rua do Comercio, 500', latitude: -23.5380, longitude: -46.5160},
      {id: '4', nome: 'MERKATU Florianópolis', endereco: 'Rua Vereador Walter Borges, 219 - Campinas, CEP 88101030', latitude: -27.6000, longitude: -48.5500}
    ];
  }
  
  try {
    estoque = await fetch(`${API_URL}/estoque`).then(r => r.json());
  } catch {}
  
  renderStoresAdminTable();
  renderEstoqueAdminTable();
  setupTabButtons();
  setupStoreForm();
  updateAnalytics();
}

function renderStoresAdminTable() {
  const tbody = document.getElementById('storesAdminBody');
  if (!tbody) return;
  
  tbody.innerHTML = stores.map(s => `
    <tr>
      <td>${s.nome}</td>
      <td>${s.endereco}</td>
      <td><button class="btn btn-danger" onclick="window.deleteStore('${s.id}')">X</button></td>
    </tr>
  `).join('');
}

function renderEstoqueAdminTable() {
  const tbody = document.getElementById('estoqueAdminBody');
  if (!tbody) return;
  
  tbody.innerHTML = estoque.map(e => `
    <tr><td>${e.loja}</td><td>${e.produto}</td><td>${e.quantidade}</td></tr>
  `).join('');
}

function setupTabButtons() {
  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      const tabId = btn.dataset.tab + '-tab';
      document.getElementById(tabId)?.classList.add('active');
    });
  });
}

function setupStoreForm() {
  const form = document.getElementById('storeForm');
  if (!form) return;
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const storeName = document.getElementById('storeName').value;
    if (!storeName.trim()) {
      alert('⚠️ Digite o nome da loja!');
      return;
    }
    
    const newStore = {
      id: Date.now().toString(),
      nome: storeName,
      endereco: document.getElementById('storeAddress').value || 'Endereço não informado',
      latitude: parseFloat(document.getElementById('storeLat').value),
      longitude: parseFloat(document.getElementById('storeLng').value),
      telefone: document.getElementById('storePhone').value || '(00) 0000-0000'
    };
    
    stores.push(newStore);
    
    // Atualizar marcador no mapa com popup definitivo
    if (currentMarkerData) {
      currentMarkerData.marker.setPopupContent(`
        <div style="text-align: center;">
          <h3><span class="logo-inline"><span class="m outer">M</span><span class="m inner">M</span></span> ${newStore.nome}</h3>
          <p><strong>${newStore.endereco}</strong></p>
          <p>📞 ${newStore.telefone}</p>
          <a href="https://maps.google.com/?q=${newStore.latitude},${newStore.longitude}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 12px; background: #39FF14; color: #000; text-decoration: none; border-radius: 5px; font-weight: 700;">
            📍 Abrir no Google Maps
          </a>
        </div>
      `);
      
      // Remover do array de novos marcadores (agora é uma loja oficial)
      const idx = newMarkers.findIndex(m => m.id === currentMarkerData.id);
      if (idx > -1) {
        newMarkers.splice(idx, 1);
      }
      currentMarkerData = null;
    }
    
    // Limpar o formulário
    window.closeStoreForm();
    
    // Renderizar stores e navegar para lojas
    renderStoresList(stores);
    
    console.log('✓ Loja adicionada ao mapa!');
    alert(`✓ ${newStore.nome} adicionada com sucesso!`);
    
    // Navegar para a página de lojas
    setTimeout(() => {
      window.navigateTo('/lojas');
    }, 500);
  });
}

window.openStoreForm = function() {
  const modal = document.getElementById('storeModal');
  if (modal) modal.classList.add('show');
};

window.closeStoreForm = function() {
  const modal = document.getElementById('storeModal');
  if (modal) modal.classList.remove('show');
  document.getElementById('storeForm')?.reset();
  
  // Desativar modo de clique
  if (mapClickMode) {
    mapClickMode = false;
    const btn = document.getElementById('mapModeBtn');
    if (btn) {
      btn.textContent = '➕ Adicionar Loja';
      btn.className = 'btn btn-secondary';
    }
    const info = document.getElementById('mapClickInfo');
    if (info) info.style.display = 'none';
  }
  
  // Esconder botão de descartar
  const discardBtn = document.getElementById('discardBtn');
  if (discardBtn) discardBtn.style.display = 'none';
};

window.deleteStore = function(id) {
  if (confirm('Deletar loja?')) {
    stores = stores.filter(s => s.id !== id);
    renderStoresAdminTable();
  }
};

function updateAnalytics() {
  const low = estoque.filter(e => e.quantidade <= e.minimo).length;
  
  const el1 = document.getElementById('totalStores');
  const el2 = document.getElementById('totalProducts');
  const el3 = document.getElementById('lowStockCount');
  
  if (el1) el1.textContent = stores.length;
  if (el2) el2.textContent = estoque.length;
  if (el3) el3.textContent = low;
}

let map = null;
let userMarker = null;
let mapClickMode = false;
let newMarkers = []; // Array para armazenar marcadores novos
let currentMarkerData = null; // Dados do marcador atual sendo editado

async function loadMapPage() {
  console.log('🗺️ Loading mapa...');
  try {
    stores = await fetch(`${API_URL}/lojas`).then(r => r.json());
  } catch {
    stores = [
      {id: '1', nome: 'MERKATU Centro', endereco: 'Rua Principal, 123', latitude: -23.5505, longitude: -46.6333, telefone: '(11) 3000-1000'},
      {id: '2', nome: 'MERKATU Zona Sul', endereco: 'Av. Paulista, 1000', latitude: -23.5613, longitude: -46.6560, telefone: '(11) 3000-2000'},
      {id: '3', nome: 'MERKATU Zona Norte', endereco: 'Rua do Comercio, 500', latitude: -23.5380, longitude: -46.5160, telefone: '(11) 3000-3000'},
      {id: '4', nome: 'MERKATU Florianópolis', endereco: 'Rua Vereador Walter Borges, 219 - Campinas, CEP 88101030', latitude: -27.6000, longitude: -48.5500, telefone: '(48) 3000-4000'}
    ];
  }
  
  initializeMap();
}

function initializeMap() {
  setTimeout(() => {
    const container = document.getElementById('mapContainer');
    if (!container) {
      console.error('❌ mapContainer não encontrado');
      return;
    }
    
    // Criar mapa centralizado em São Paulo
    map = L.map('mapContainer').setView([-23.5505, -46.6333], 12);
    
    // Adicionar tile layer (mapa base)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map);
    
    // Adicionar marcadores das lojas
    stores.forEach(store => {
      const marker = L.marker([store.latitude, store.longitude])
        .addTo(map)
        .bindPopup(`
          <div style="text-align: center;">
            <h3><span class="logo-inline"><span class="m outer">M</span><span class="m inner">M</span></span> ${store.nome}</h3>
            <p><strong>${store.endereco}</strong></p>
            <p>📞 ${store.telefone}</p>
            <a href="https://maps.google.com/?q=${store.latitude},${store.longitude}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 12px; background: #39FF14; color: #000; text-decoration: none; border-radius: 5px; font-weight: 700;">
              📍 Abrir no Google Maps
            </a>
          </div>
        `)
        .on('click', function() {
          console.log('Clicou em:', store.nome);
        });
    });
    
    // Permitir clique no mapa para adicionar lojas
    map.on('click', function(e) {
      if (mapClickMode) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        
        // Criar novo marcador
        const newMarker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxMyIgZmlsbD0iIzM5RkYxNCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=',
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          })
        }).addTo(map);
        
        // Armazenar dados do marcador
        const markerData = {
          id: Date.now(),
          lat: lat,
          lng: lng,
          marker: newMarker,
          nome: 'Nova Loja'
        };
        
        newMarkers.push(markerData);
        currentMarkerData = markerData;
        
        // Popup com opções de editar
        newMarker.bindPopup(`
          <div style="text-align: center; color: var(--text); background: var(--panel); border-radius: 6px;">
            <strong style="color: var(--neon);">✓ ${markerData.nome}</strong><br>
            <div style="margin-top: 10px; display: flex; gap: 5px; flex-direction: column;">
              <button onclick="window.editMarkerName(${markerData.id})" style="padding: 6px 10px; background: var(--neon); color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">✏️ Editar Nome</button>
              <button onclick="window.confirmMarker(${markerData.id})" style="padding: 6px 10px; background: #39FF14; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">✓ Confirmar</button>
              <button onclick="window.removeMarker(${markerData.id})" style="padding: 6px 10px; background: #FF0040; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">🗑️ Remover</button>
            </div>
          </div>
        `).openPopup();
        
        // Mostrar botão de descartar
        const discardBtn = document.getElementById('discardBtn');
        if (discardBtn) discardBtn.style.display = 'inline-block';
        
        // Abrir modal para adicionar mais detalhes
        setTimeout(() => {
          document.getElementById('storeLat').value = lat.toFixed(6);
          document.getElementById('storeLng').value = lng.toFixed(6);
          document.getElementById('storeName').value = markerData.nome;
          document.getElementById('storeName').focus();
          window.openStoreForm();
        }, 300);
      }
    });
    
    console.log('✓ Mapa carregado com', stores.length, 'lojas');
  }, 100);
}

window.setMapClickMode = function() {
  mapClickMode = !mapClickMode;
  const info = document.getElementById('mapClickInfo');
  const btn = document.getElementById('mapModeBtn');
  const discardBtn = document.getElementById('discardBtn');
  
  if (info) {
    info.style.display = mapClickMode ? 'block' : 'none';
  }
  
  if (btn) {
    btn.textContent = mapClickMode ? '❌ Cancelar Adição' : '➕ Adicionar Loja';
    btn.className = mapClickMode ? 'btn btn-danger' : 'btn btn-secondary';
  }
  
  console.log('Modo de clique:', mapClickMode ? 'ATIVO' : 'INATIVO');
};

window.discardMarker = function() {
  if (currentMarkerData) {
    const idx = newMarkers.findIndex(m => m.id === currentMarkerData.id);
    if (idx > -1) {
      map.removeLayer(newMarkers[idx].marker);
      newMarkers.splice(idx, 1);
      currentMarkerData = null;
      console.log('✓ Marcador descartado');
    }
  }
};

window.editMarkerName = function(markerId) {
  const markerData = newMarkers.find(m => m.id === markerId);
  if (!markerData) return;
  
  const newName = prompt('Digite o novo nome da loja:', markerData.nome);
  if (newName && newName.trim()) {
    markerData.nome = newName.trim();
    document.getElementById('storeName').value = markerData.nome;
    
    // Atualizar popup
    markerData.marker.setPopupContent(`
      <div style="text-align: center; color: var(--text); background: var(--panel); border-radius: 6px;">
        <strong style="color: var(--neon);">✓ ${markerData.nome}</strong><br>
        <div style="margin-top: 10px; display: flex; gap: 5px; flex-direction: column;">
          <button onclick="window.editMarkerName(${markerId})" style="padding: 6px 10px; background: var(--neon); color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">✏️ Editar Nome</button>
          <button onclick="window.confirmMarker(${markerId})" style="padding: 6px 10px; background: #39FF14; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">✓ Confirmar</button>
          <button onclick="window.removeMarker(${markerId})" style="padding: 6px 10px; background: #FF0040; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">🗑️ Remover</button>
        </div>
      </div>
    `);
  }
};

window.confirmMarker = function(markerId) {
  const markerData = newMarkers.find(m => m.id === markerId);
  if (!markerData) return;
  
  // Abrir modal para confirmar detalhes
  document.getElementById('storeLat').value = markerData.lat.toFixed(6);
  document.getElementById('storeLng').value = markerData.lng.toFixed(6);
  document.getElementById('storeName').value = markerData.nome;
  document.getElementById('storeName').focus();
  currentMarkerData = markerData;
  window.openStoreForm();
};

window.removeMarker = function(markerId) {
  if (confirm('Tem certeza que deseja remover este marcador?')) {
    const idx = newMarkers.findIndex(m => m.id === markerId);
    if (idx > -1) {
      map.removeLayer(newMarkers[idx].marker);
      newMarkers.splice(idx, 1);
      if (currentMarkerData?.id === markerId) currentMarkerData = null;
      console.log('✓ Marcador removido');
    }
  }
};

window.getUserLocation = function() {
  console.log('📍 Obtendo localização do usuário...');
  
  if (!navigator.geolocation) {
    alert('Seu navegador não suporta geolocalização');
    return;
  }
  
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      
      console.log('✓ Localização obtida:', lat, lng);
      
      // Remover marcador anterior se existir
      if (userMarker) map.removeLayer(userMarker);
      
      // Adicionar marcador azul da localização do usuário
      userMarker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzY2N2VlYSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      })
      .addTo(map)
      .bindPopup('📍 Sua localização')
      .openPopup();
      
      // Centralizar mapa na localização do usuário
      map.setView([lat, lng], 13);
      
      // Encontrar loja mais próxima
      const proximaLoja = stores.reduce((prev, curr) => {
        const distPrev = Math.sqrt(Math.pow(prev.latitude - lat, 2) + Math.pow(prev.longitude - lng, 2));
        const distCurr = Math.sqrt(Math.pow(curr.latitude - lat, 2) + Math.pow(curr.longitude - lng, 2));
        return distCurr < distPrev ? curr : prev;
      });
      
      alert(`✓ Loja mais próxima: ${proximaLoja.nome}\n${proximaLoja.endereco}`);
    },
    (error) => {
      console.error('Erro ao obter localização:', error);
      alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
    }
  );
};
document.addEventListener('DOMContentLoaded', () => {
  console.log('✓ DOM pronto');
  window.navigateTo('/');
});
