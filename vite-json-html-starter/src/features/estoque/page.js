import { fetchInventory } from '../../lib/data-service';
import { appState } from '../../state/app-state';

export function renderEstoquePage() {
  return `
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
          <tbody id="estoqueBody"></tbody>
        </table>
      </div>
    </div>

    <div style="margin-top: 20px;">
      <button class="btn btn-secondary" onclick="window.navigateTo('/admin')">⚙️ Admin</button>
      <button class="btn btn-secondary" onclick="window.navigateTo('/')">◄ Voltar</button>
    </div>
  `;
}

export async function loadEstoquePage() {
  appState.estoque = await fetchInventory();
  setupEstoqueFilters();
  renderEstoqueTable(appState.estoque);
}

function setupEstoqueFilters() {
  const lojas = [...new Set(appState.estoque.map((item) => item.loja))];
  const select = document.getElementById('storeFilter');
  if (select) {
    select.innerHTML = '<option value="">Todas</option>' + lojas.map((loja) => `<option value="${loja}">${loja}</option>`).join('');
    select.addEventListener('change', applyEstoqueFilters);
  }

  const search = document.getElementById('productSearch');
  if (search) {
    search.addEventListener('keyup', applyEstoqueFilters);
  }
}

function applyEstoqueFilters() {
  const selectedStore = document.getElementById('storeFilter')?.value || '';
  const searchTerm = document.getElementById('productSearch')?.value.toLowerCase() || '';

  const filteredItems = appState.estoque.filter((item) => (
    (!selectedStore || item.loja === selectedStore)
    && (!searchTerm || item.produto.toLowerCase().includes(searchTerm))
  ));

  renderEstoqueTable(filteredItems);
}

function renderEstoqueTable(data) {
  const tbody = document.getElementById('estoqueBody');
  if (!tbody) {
    return;
  }

  tbody.innerHTML = data.map((item) => {
    const status = item.quantidade === 0 ? 'critical' : item.quantidade <= item.minimo ? 'low' : 'ok';
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
