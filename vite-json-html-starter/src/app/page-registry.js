import { renderAdminPage, loadAdminPage } from '../features/admin/page';
import { renderEstoquePage, loadEstoquePage } from '../features/estoque/page';
import { renderHomePage } from '../features/home/page';
import { renderLojasPage, loadStoresPage } from '../features/lojas/page';
import { renderMapPage, loadMapPage } from '../features/mapa/page';

export const pageRegistry = {
  '/': {
    render: renderHomePage
  },
  '/lojas': {
    render: renderLojasPage,
    load: loadStoresPage
  },
  '/estoque': {
    render: renderEstoquePage,
    load: loadEstoquePage
  },
  '/admin': {
    render: renderAdminPage,
    load: loadAdminPage
  },
  '/mapa': {
    render: renderMapPage,
    load: loadMapPage
  }
};
