import { fetchStores } from '../../lib/data-service';
import { appState } from '../../state/app-state';

export function renderLojasPage() {
  return `
    <div>
      <div style="margin-bottom: 30px;">
        <h1 style="color: var(--neon); margin-bottom: 8px;">Nossas Lojas</h1>
        <p style="color: var(--text); margin-bottom: 20px;">Busque por nome de loja para encontrar perto de você</p>
        <input type="text" id="searchStores" class="search-input" placeholder="🔍 Buscar loja por nome...">
      </div>
      <div id="storesList" class="stores-grid"></div>
      <button class="btn btn-secondary" style="margin-top: 20px;" onclick="window.navigateTo('/')">◄ Voltar</button>
    </div>
  `;
}

export async function loadStoresPage() {
  appState.stores = await fetchStores();
  renderStoresList(appState.stores);

  const search = document.getElementById('searchStores');
  if (!search) {
    return;
  }

  search.addEventListener('keyup', (event) => {
    const term = event.target.value.toLowerCase();
    const filteredStores = appState.stores.filter((store) => store.nome.toLowerCase().includes(term));
    renderStoresList(filteredStores);
  });
}

export function renderStoresList(data) {
  const list = document.getElementById('storesList');
  if (!list) {
    return;
  }

  list.innerHTML = data.map((store) => `
    <div class="store-card">
      <h3><span class="logo-inline"><span class="m outer">M</span><span class="m inner">M</span></span> ${store.nome}</h3>
      <p>${store.endereco}</p>
      <p>📞 ${store.telefone}</p>
    </div>
  `).join('');
}
