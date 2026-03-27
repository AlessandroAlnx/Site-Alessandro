import { pageRegistry } from './page-registry';

export function navigateTo(path) {
  const app = document.getElementById('app');
  if (!app) {
    return;
  }

  const page = pageRegistry[path] ?? pageRegistry['/'];
  app.innerHTML = page.render();

  if (typeof page.load === 'function') {
    setTimeout(() => {
      page.load();
    }, 10);
  }
}
