## 🎯 MERKATU - Guia Rápido de Uso

### ✅ Status Atual
- ✨ **Projeto criado e configurado**
- 🏪 **3 Lojas de exemplo já cadastradas**
- 📦 **5 Produtos no estoque**
- 🚀 **Frontend rodando em http://localhost:3000**
- 🔌 **API rodando em http://localhost:3001**

---

## 🚀 COMO ACESSAR

### 1️⃣ Frontend (Vite)
```
http://localhost:3000
```
**Páginas Disponíveis:**
- `/` - Home
- `/lojas` - Catálogo de lojas
- `/estoque` - Ver estoque dos produtos
- `/admin` - Painel administrativo
- `/sobre` - Informações sobre MERKATU

### 2️⃣ API Backend
```
http://localhost:3001/api/health
```
**Endpoints principais:**
- `GET /api/lojas` - Listar todas as lojas
- `GET /api/estoque` - Listar estoque completo
- `GET /api/analytics` - Estatísticas gerais

---

## 👥 USUÁRIOS DE TESTE

### Cliente (Qualquer um)
- Acesse `/lojas` para ver as 3 lojas
- Clique em "Estoque" para ver produtos
- Use a busca para filtrar lojas

### Administrador
- Acesse `/admin`
- **Gerenciar Lojas**: Adicionar, editar ou deletar lojas
- **Gerenciar Estoque**: Atualizar quantidades e preços
- **Analytics**: Ver estatísticas em tempo real

---

## 🏪 LOJAS DE EXEMPLO

| Nome | Endereço | Telefone | Produtos |
|------|----------|----------|----------|
| MERKATU Centro | Rua Principal, 123 | (11) 3000-1000 | 2 |
| MERKATU Zona Sul | Av. Paulista, 1000 | (11) 3000-2000 | 2 |
| MERKATU Zona Norte | Rua do Comércio, 500 | (11) 3000-3000 | 1 |

---

## 📦 PRODUTOS DE EXEMPLO

- **Produto A** - R$ 29,99 (150 un em Centro, 200 un em Zona Sul)
- **Produto B** - R$ 49,99 (30 un em Centro, 80 un em Zona Norte)
- **Produto C** - R$ 99,99 (5 un em Zona Sul - ⚠️ BAIXO ESTOQUE)

---

## 🔧 INICIAR SERVIDORES

### Primeira vez (já feito):
```bash
npm install
```

### A cada vez que começar:

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run api
```

Ou em um terminal único (não recomendado):
```bash
npm run dev & npm run api
```

---

## 🎨 FUNCIONALIDADES PRINCIPAIS

### Para Clientes ✨
- ✅ Ver todas as lojas no mapa
- ✅ Buscar lojas por nome
- ✅ Consultar estoque de produtos
- ✅ Ver endereço e telefone das lojas

### Para Admin ⚙️
- ✅ Criar novas lojas (modal com formulário)
- ✅ Marcar lojas no mapa com coordenadas GPS
- ✅ Gerenciar produtos (adicionar/editar/deletar)
- ✅ Receber alertas de estoque baixo
- ✅ Ver analíticas em tempo real
- ✅ Status de estoque automático (OK/Baixo/Crítico)

---

## 🗺️ MAPA

O mapa está pronto para integração com:
- **Leaflet.js** - Biblioteca de mapa leve
- **OpenStreetMap** - Serviço de mapa gratuito

Basta descomentar e instalar quando quiser implementar.

---

## 🌐 ENDPOINTS DA API

### Lojas
```
GET    /api/lojas
POST   /api/lojas
GET    /api/lojas/:id
PUT    /api/lojas/:id
DELETE /api/lojas/:id
```

### Estoque
```
GET    /api/estoque
POST   /api/estoque
GET    /api/estoque/loja/:loja
GET    /api/estoque/produto/:produto
PUT    /api/estoque/:id
DELETE /api/estoque/:id
```

### Geolocalização
```
GET /api/lojas/proxima/:lat/:lng
```

### Analíticas
```
GET /api/analytics
```

---

## 💡 PRÓXIMAS FUNCIONALIDADES A IMPLEMENTAR

✨ Ideias para expandir:
- [ ] Integração com banco de dados (MongoDB/PostgreSQL)
- [ ] Sistema de login e autenticação
- [ ] Upload de imagens de produtos
- [ ] Carrinho de compras
- [ ] Sistema de pedidos
- [ ] Histórico de transações
- [ ] Notificações em tempo real
- [ ] Integração com Stripe (pagamentos)
- [ ] Avaliações de produtos
- [ ] Relatórios avançados

---

## 🆘 TROUBLESHOOTING

### Porta 3000/3001 já em uso?
```powershell
# Matar todos os processos node
taskkill /IM node.exe /F

# Depois iniciar novamente
npm run dev
npm run api
```

### página branca?
1. Abra o console (F12)
2. Verifique se há erros
3. Limpe o cache (Ctrl+Shift+Del)

### API não responde?
1. Verifique se o backend está rodando
2. Teste em http://localhost:3001/api/health
3. Verifique a porta 3001

---

## 📊 INFORMAÇÕES DO PROJETO

- **Nome**: MERKATU
- **Versão**: 1.0.0
- **Tipo**: Full Stack Web Application
- **Frontend**: Vite + JavaScript Vanilla
- **Backend**: Node.js + Express
- **Estilo**: Responsivo (Mobile, Tablet, Desktop)
- **Licença**: MIT

---

## 👨‍💻 ESTRUTURA DE ARQUIVOS

```
/src
  ├── main.js (Lógica + Roteamento)
  ├── styles/
  │   └── main.css (Estilos completos)
  └── pages/
      ├── home.html
      ├── lojas.html
      ├── estoque.html
      ├── admin.html
      └── sobre.html

/api
  └── server.js (Backend Express)

index.html (Entrada da app)
```

---

**Aproveite! 🎉 MERKATU está pronta para uso!**
