import { API_URL } from '../config/api';
import { fallbackInventory, fallbackStores } from './fallback-data';
import { normalizeInventoryItem, normalizeStore } from './normalizers';

async function fetchCollection(path) {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    throw new Error(`Falha ao buscar ${path}`);
  }

  return response.json();
}

export async function fetchStores() {
  try {
    const stores = await fetchCollection('/lojas');
    return stores.map(normalizeStore);
  } catch (error) {
    console.warn('API de lojas indisponível, usando fallback.', error);
    return fallbackStores.map(normalizeStore);
  }
}

export async function fetchInventory() {
  try {
    const inventory = await fetchCollection('/estoque');
    return inventory.map(normalizeInventoryItem);
  } catch (error) {
    console.warn('API de estoque indisponível, usando fallback.', error);
    return fallbackInventory.map(normalizeInventoryItem);
  }
}
