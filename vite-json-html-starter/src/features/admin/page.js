import { fetchInventory, fetchStores } from '../../lib/data-service';
import { getStoreId } from '../../lib/normalizers';
import { appState } from '../../state/app-state';
import { buildStorePopupHtml } from '../mapa/popup';

export function renderAdminPage() {
  return `
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
  `;
}

export async function loadAdminPage() {
  appState.stores = await fetchStores();
  appState.estoque = await fetchInventory();

  renderStoresAdminTable();
  renderEstoqueAdminTable();
  setupTabButtons();
  setupStoreForm();
  updateAnalytics();
}

export function registerAdminActions() {
  window.openStoreForm = openStoreForm;
  window.closeStoreForm = closeStoreForm;
  window.deleteStore = deleteStore;
}

function renderStoresAdminTable() {
  const tbody = document.getElementById('storesAdminBody');
  if (!tbody) {
    return;
  }

  tbody.innerHTML = appState.stores.map((store) => `
    <tr>
      <td>${store.nome}</td>
      <td>${store.endereco}</td>
      <td><button class="btn btn-danger" onclick="window.deleteStore('${getStoreId(store)}')">X</button></td>
    </tr>
  `).join('');
}

function renderEstoqueAdminTable() {
  const tbody = document.getElementById('estoqueAdminBody');
  if (!tbody) {
    return;
  }

  tbody.innerHTML = appState.estoque.map((item) => `
    <tr><td>${item.loja}</td><td>${item.produto}</td><td>${item.quantidade}</td></tr>
  `).join('');
}

function setupTabButtons() {
  document.querySelectorAll('.tab-btn').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach((item) => item.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach((item) => item.classList.remove('active'));

      button.classList.add('active');
      document.getElementById(`${button.dataset.tab}-tab`)?.classList.add('active');
    });
  });
}

function setupStoreForm() {
  const form = document.getElementById('storeForm');
  if (!form) {
    return;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const storeName = document.getElementById('storeName').value;
    if (!storeName.trim()) {
      alert('⚠️ Digite o nome da loja!');
      return;
    }

    const newStore = {
      id: String(Date.now()),
      nome: storeName,
      endereco: document.getElementById('storeAddress').value || 'Endereço não informado',
      latitude: Number.parseFloat(document.getElementById('storeLat').value),
      longitude: Number.parseFloat(document.getElementById('storeLng').value),
      telefone: document.getElementById('storePhone').value || '(00) 0000-0000'
    };

    appState.stores.push(newStore);

    if (appState.currentMarkerData) {
      appState.currentMarkerData.marker.setPopupContent(buildStorePopupHtml(newStore));
      const markerIndex = appState.newMarkers.findIndex((marker) => marker.id === appState.currentMarkerData.id);
      if (markerIndex > -1) {
        appState.newMarkers.splice(markerIndex, 1);
      }
      appState.currentMarkerData = null;
    }

    closeStoreForm();
    renderStoresAdminTable();
    updateAnalytics();

    alert(`✓ ${newStore.nome} adicionada com sucesso!`);

    setTimeout(() => {
      window.navigateTo('/lojas');
    }, 500);
  });
}

function openStoreForm() {
  document.getElementById('storeModal')?.classList.add('show');
}

function closeStoreForm() {
  document.getElementById('storeModal')?.classList.remove('show');
  document.getElementById('storeForm')?.reset();
  appState.mapClickMode = false;
}

function deleteStore(id) {
  if (!confirm('Deletar loja?')) {
    return;
  }

  appState.stores = appState.stores.filter((store) => getStoreId(store) !== id);
  renderStoresAdminTable();
  updateAnalytics();
}

function updateAnalytics() {
  const lowStockCount = appState.estoque.filter((item) => item.quantidade <= item.minimo).length;

  const totalStores = document.getElementById('totalStores');
  const totalProducts = document.getElementById('totalProducts');
  const lowStock = document.getElementById('lowStockCount');

  if (totalStores) {
    totalStores.textContent = String(appState.stores.length);
  }

  if (totalProducts) {
    totalProducts.textContent = String(appState.estoque.length);
  }

  if (lowStock) {
    lowStock.textContent = String(lowStockCount);
  }
}
