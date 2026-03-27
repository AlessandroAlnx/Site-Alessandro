# MERKATU / Site-Alessandro

Projeto com frontend em Vite e backend em Express para gerenciamento de lojas e estoque.

## Estrutura ativa

```text
Site-Alessandro/
├── backend/
│   ├── server.js                 # Ponto de entrada do backend
│   └── src/
│       ├── app.js               # Configuração do Express
│       ├── data/
│       │   └── memory-store.js  # Dados em memória e operações CRUD
│       ├── routes/
│       │   ├── health.js        # Rotas de saúde
│       │   ├── lojas.js         # Rotas de lojas
│       │   └── estoque.js       # Rotas de estoque
│       └── legacy/              # Arquivos antigos preservados
├── vite-json-html-starter/
│   ├── src/
│   │   ├── app/                 # Bootstrap, router e registro de páginas
│   │   ├── config/              # Configuração central
│   │   ├── features/            # UI e lógica por funcionalidade
│   │   ├── lib/                 # Serviços e normalização de dados
│   │   ├── state/               # Estado compartilhado da aplicação
│   │   ├── styles/              # Estilos globais
│   │   └── main.js              # Entrada enxuta do frontend
│   └── legacy/                  # Estrutura antiga do template Vite
├── docker-compose.yml           # Sobe frontend + backend juntos
└── diagrams/                    # Diagramas do projeto
```

## Onde editar cada coisa

- Rotas da API: `backend/src/routes`
- Dados iniciais em memória: `backend/src/data/memory-store.js`
- Configuração geral do backend: `backend/src/app.js`
- Navegação entre páginas: `vite-json-html-starter/src/app/page-registry.js`
- Página de lojas: `vite-json-html-starter/src/features/lojas/page.js`
- Página de estoque: `vite-json-html-starter/src/features/estoque/page.js`
- Página admin: `vite-json-html-starter/src/features/admin/page.js`
- Página do mapa: `vite-json-html-starter/src/features/mapa/page.js`
- URL da API e serviços de fetch: `vite-json-html-starter/src/config/api.js` e `vite-json-html-starter/src/lib/data-service.js`
- Estado compartilhado do frontend: `vite-json-html-starter/src/state/app-state.js`
- Estilos globais: `vite-json-html-starter/src/styles/main.css`

## Arquivos legacy

Arquivos antigos que não fazem parte do fluxo atual foram movidos para pastas `legacy/` em vez de serem apagados. Assim a estrutura principal fica limpa, mas você ainda consegue consultar o material anterior se precisar.

## Execução

Subir tudo com Docker:

```bash
docker compose up --build -d
```

Parar containers:

```bash
docker compose down
```

URLs:

- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- Health check: http://localhost:3001/api/health
