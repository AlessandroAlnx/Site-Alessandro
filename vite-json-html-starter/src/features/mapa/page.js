import { fetchStores } from '../../lib/data-service';
import { appState } from '../../state/app-state';
import { buildStorePopupHtml } from './popup';

export function renderMapPage() {
  return `
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
  `;
}

export async function loadMapPage() {
  appState.stores = await fetchStores();
  initializeMap();
}

export function registerMapActions() {
  window.setMapClickMode = toggleMapClickMode;
  window.discardMarker = discardMarker;
  window.editMarkerName = editMarkerName;
  window.confirmMarker = confirmMarker;
  window.removeMarker = removeMarker;
  window.getUserLocation = getUserLocation;
}

function initializeMap() {
  setTimeout(() => {
    const container = document.getElementById('mapContainer');
    if (!container || typeof L === 'undefined') {
      return;
    }

    if (appState.map) {
      appState.map.remove();
      appState.map = null;
    }

    appState.map = L.map('mapContainer').setView([-27.5954, -48.548], 11);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(appState.map);

    appState.stores.forEach((store) => {
      L.marker([store.latitude, store.longitude])
        .addTo(appState.map)
        .bindPopup(buildStorePopupHtml(store));
    });

    appState.map.on('click', (event) => {
      if (!appState.mapClickMode) {
        return;
      }

      const marker = L.marker([event.latlng.lat, event.latlng.lng], {
        icon: L.icon({
          iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIzMiIgdmlld0JveD0iMCAwIDMyIDMyIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxMyIgZmlsbD0iIzM5RkYxNCIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=',
          iconSize: [32, 32],
          iconAnchor: [16, 32]
        })
      }).addTo(appState.map);

      const markerData = {
        id: Date.now(),
        lat: event.latlng.lat,
        lng: event.latlng.lng,
        marker,
        nome: 'Nova Loja'
      };

      appState.newMarkers.push(markerData);
      appState.currentMarkerData = markerData;
      marker.bindPopup('<div></div>');
      updateMarkerPopup(markerData.id);
      marker.openPopup();

      const discardButton = document.getElementById('discardBtn');
      if (discardButton) {
        discardButton.style.display = 'inline-block';
      }
    });
  }, 100);
}

function toggleMapClickMode() {
  appState.mapClickMode = !appState.mapClickMode;

  const info = document.getElementById('mapClickInfo');
  const button = document.getElementById('mapModeBtn');

  if (info) {
    info.style.display = appState.mapClickMode ? 'block' : 'none';
  }

  if (button) {
    button.textContent = appState.mapClickMode ? '❌ Cancelar Adição' : '➕ Adicionar Loja';
    button.className = appState.mapClickMode ? 'btn btn-danger' : 'btn btn-secondary';
  }
}

function discardMarker() {
  if (!appState.currentMarkerData || !appState.map) {
    return;
  }

  const markerIndex = appState.newMarkers.findIndex((marker) => marker.id === appState.currentMarkerData.id);
  if (markerIndex > -1) {
    appState.map.removeLayer(appState.newMarkers[markerIndex].marker);
    appState.newMarkers.splice(markerIndex, 1);
  }

  appState.currentMarkerData = null;

  const discardButton = document.getElementById('discardBtn');
  if (discardButton) {
    discardButton.style.display = 'none';
  }
}

function editMarkerName(markerId) {
  const markerData = appState.newMarkers.find((marker) => marker.id === markerId);
  if (!markerData) {
    return;
  }

  const newName = prompt('✏️ Digite o novo nome da loja:\n\n(Exemplo: MERKATU Centro, MERKATU Lagoa, etc)', markerData.nome);
  if (!newName || !newName.trim()) {
    return;
  }

  markerData.nome = newName.trim();
  const storeNameField = document.getElementById('storeName');
  if (storeNameField) {
    storeNameField.value = markerData.nome;
  }

  updateMarkerPopup(markerId);
}

function confirmMarker(markerId) {
  const markerData = appState.newMarkers.find((marker) => marker.id === markerId);
  if (!markerData) {
    return;
  }

  const newStore = {
    id: String(Date.now()),
    nome: markerData.nome,
    endereco: prompt('📍 Endereço da loja:', 'Digite o endereço completo') || 'Endereço não informado',
    latitude: markerData.lat,
    longitude: markerData.lng,
    telefone: prompt('📞 Telefone:', '(00) 0000-0000') || '(00) 0000-0000'
  };

  appState.stores.push(newStore);
  markerData.marker.setPopupContent(buildStorePopupHtml(newStore));
  removePendingMarker(markerId, false);
  resetMapUiState();
  alert(`✅ ${newStore.nome} adicionada com sucesso!`);

  setTimeout(() => {
    window.navigateTo('/lojas');
  }, 500);
}

function removeMarker(markerId) {
  if (!confirm('Tem certeza que deseja remover este marcador?')) {
    return;
  }

  removePendingMarker(markerId, true);
  alert('Marcador removido!');
}

function removePendingMarker(markerId, removeFromMap) {
  const markerIndex = appState.newMarkers.findIndex((marker) => marker.id === markerId);
  if (markerIndex === -1) {
    return;
  }

  if (removeFromMap && appState.map) {
    appState.map.removeLayer(appState.newMarkers[markerIndex].marker);
  }

  appState.newMarkers.splice(markerIndex, 1);
  if (appState.currentMarkerData?.id === markerId) {
    appState.currentMarkerData = null;
  }
}

function resetMapUiState() {
  appState.mapClickMode = false;
  appState.currentMarkerData = null;

  const button = document.getElementById('mapModeBtn');
  if (button) {
    button.textContent = '➕ Adicionar Loja';
    button.className = 'btn btn-secondary';
  }

  const info = document.getElementById('mapClickInfo');
  if (info) {
    info.style.display = 'none';
  }

  const discardButton = document.getElementById('discardBtn');
  if (discardButton) {
    discardButton.style.display = 'none';
  }
}

function updateMarkerPopup(markerId) {
  const markerData = appState.newMarkers.find((marker) => marker.id === markerId);
  if (!markerData) {
    return;
  }

  markerData.marker.setPopupContent(`
    <div style="text-align: center;">
      <strong style="color: #39FF14; font-size: 1.1em;">✓ ${markerData.nome}</strong><br>
      <div style="margin-top: 10px; display: flex; gap: 5px; flex-direction: column;">
        <button id="editBtn-${markerId}" style="padding: 6px 10px; background: #39FF14; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">✏️ Editar Nome</button>
        <button id="confirmBtn-${markerId}" style="padding: 6px 10px; background: #39FF14; color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">✓ Confirmar</button>
        <button id="removeBtn-${markerId}" style="padding: 6px 10px; background: #FF0040; color: #fff; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">🗑️ Remover</button>
      </div>
    </div>
  `);

  setTimeout(() => {
    document.getElementById(`editBtn-${markerId}`)?.addEventListener('click', () => editMarkerName(markerId));
    document.getElementById(`confirmBtn-${markerId}`)?.addEventListener('click', () => confirmMarker(markerId));
    document.getElementById(`removeBtn-${markerId}`)?.addEventListener('click', () => removeMarker(markerId));
  }, 50);
}

function getUserLocation() {
  if (!navigator.geolocation) {
    alert('Seu navegador não suporta geolocalização');
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      if (!appState.map) {
        return;
      }

      const { latitude, longitude } = position.coords;

      if (appState.userMarker) {
        appState.map.removeLayer(appState.userMarker);
      }

      appState.userMarker = L.marker([latitude, longitude], {
        icon: L.icon({
          iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIgZmlsbD0iIzY2N2VlYSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9zdmc+',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      })
        .addTo(appState.map)
        .bindPopup('📍 Sua localização')
        .openPopup();

      appState.map.setView([latitude, longitude], 13);

      if (!appState.stores.length) {
        return;
      }

      const nearestStore = appState.stores.reduce((nearest, current) => {
        const nearestDistance = Math.hypot(nearest.latitude - latitude, nearest.longitude - longitude);
        const currentDistance = Math.hypot(current.latitude - latitude, current.longitude - longitude);
        return currentDistance < nearestDistance ? current : nearest;
      });

      alert(`✓ Loja mais próxima: ${nearestStore.nome}\n${nearestStore.endereco}`);
    },
    () => {
      alert('Não foi possível obter sua localização. Verifique as permissões do navegador.');
    }
  );
}
