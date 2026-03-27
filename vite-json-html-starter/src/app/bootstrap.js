import { registerAdminActions } from '../features/admin/page';
import { registerMapActions } from '../features/mapa/page';
import { navigateTo } from './router';

export function bootstrapApp() {
  window.navigateTo = navigateTo;
  registerAdminActions();
  registerMapActions();

  document.addEventListener('DOMContentLoaded', () => {
    navigateTo('/');
  });
}
