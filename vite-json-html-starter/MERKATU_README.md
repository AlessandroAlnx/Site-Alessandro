# MERKATU Frontend Guide

Este frontend foi reorganizado para que cada área da aplicação tenha seu próprio diretório.

## Mapa rápido

- `src/features/home`: tela inicial
- `src/features/lojas`: listagem e busca de lojas
- `src/features/estoque`: tabela e filtros de estoque
- `src/features/admin`: painel administrativo
- `src/features/mapa`: mapa, geolocalização e marcadores
- `src/lib`: integração com API e normalização dos dados
- `src/state`: estado compartilhado entre páginas
- `src/app`: bootstrap e roteamento

## Fluxo de manutenção

1. Quer mudar uma tela: edite o arquivo `page.js` da funcionalidade.
2. Quer mudar consumo da API: edite `src/config/api.js` ou `src/lib/data-service.js`.
3. Quer mudar navegação: edite `src/app/page-registry.js`.
4. Quer mudar estilo global: edite `src/styles/main.css`.

## Observação

O conteúdo antigo do template Vite foi preservado em `legacy/`.
