export function renderHomePage() {
  return `
    <section class="hero">
      <h1><span class="logo-inline"><span class="m outer">M</span><span class="m inner">M</span></span> MERKATU</h1>
      <p>Plataforma de Lojas Online</p>
      <div style="display: flex; gap: 10px; justify-content: center;">
        <button class="btn btn-primary" onclick="window.navigateTo('/lojas')">Ver Lojas</button>
        <button class="btn btn-secondary" onclick="window.navigateTo('/admin')">Admin</button>
      </div>
    </section>
  `;
}
