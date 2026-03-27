# Frontend MERKATU

Frontend em Vite organizado por responsabilidade para facilitar manutenção.

## Estrutura ativa

```text
src/
├── app/            # bootstrap, router e registro das páginas
├── config/         # configuração central da aplicação
├── features/       # páginas e lógica por funcionalidade
│   ├── admin/
│   ├── estoque/
│   ├── home/
│   ├── lojas/
│   └── mapa/
├── lib/            # serviços de API, normalização e fallback
├── state/          # estado compartilhado
├── styles/         # CSS global
└── main.js         # ponto de entrada
```

## Onde editar

- Navegação: `src/app/page-registry.js`
- Inicialização: `src/app/bootstrap.js`
- Configuração da API: `src/config/api.js`
- Busca de dados: `src/lib/data-service.js`
- Home: `src/features/home/page.js`
- Lojas: `src/features/lojas/page.js`
- Estoque: `src/features/estoque/page.js`
- Admin: `src/features/admin/page.js`
- Mapa: `src/features/mapa/page.js`
- Estilos: `src/styles/main.css`

## Legacy

Arquivos antigos do template inicial foram movidos para `legacy/` para não poluir a estrutura atual.

## Comandos

```bash
npm install
npm run dev
npm run build
npm run serve
```
