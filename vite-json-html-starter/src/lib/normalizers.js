export function normalizeStore(store) {
  return {
    ...store,
    id: store.id ?? store._id
  };
}

export function normalizeInventoryItem(item) {
  return {
    ...item,
    id: item.id ?? item._id
  };
}

export function getStoreId(store) {
  return store.id ?? store._id;
}
