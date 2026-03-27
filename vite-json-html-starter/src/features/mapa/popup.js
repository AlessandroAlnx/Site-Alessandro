export function buildStorePopupHtml(store) {
  return `
    <div style="text-align: center;">
      <h3><span class="logo-inline"><span class="m outer">M</span><span class="m inner">M</span></span> ${store.nome}</h3>
      <p><strong>${store.endereco}</strong></p>
      <p>📞 ${store.telefone}</p>
      <a href="https://maps.google.com/?q=${store.latitude},${store.longitude}" target="_blank" style="display: inline-block; margin-top: 10px; padding: 8px 12px; background: #39FF14; color: #000; text-decoration: none; border-radius: 5px; font-weight: 700;">
        📍 Abrir no Google Maps
      </a>
    </div>
  `;
}
