# Documento de Estrategia de Testes - MERKATU

## Objetivo

Definir a estrategia de testes para as 3 funcionalidades principais do projeto MERKATU, cobrindo regras de negocio e casos de teste classificados como Unitario, Integracao e E2E.

## Funcionalidade 1: Lojas (listagem e loja mais proxima)

### Regras de negocio

- O sistema deve exibir a lista de lojas online cadastradas.
- A loja mais proxima deve ser calculada com base na localizacao informada pelo usuario.
- Caso o usuario nao informe localizacao valida, o sistema deve manter a listagem sem destaque de proximidade.

### Casos de teste

1. CT-LOJAS-01 (E2E) - Positivo

- Cenario: usuario acessa a pagina de lojas com geolocalizacao permitida.
- Entrada: coordenadas validas do usuario.
- Resultado esperado: lista de lojas e renderizada e a loja mais proxima aparece destacada.

2. CT-LOJAS-02 (Integracao) - Negativo

- Cenario: servico de localizacao retorna erro ou coordenadas invalidas.
- Entrada: latitude/longitude nulas ou fora do intervalo valido.
- Resultado esperado: API de lojas responde com listagem normal, sem falha da pagina e sem destaque de loja proxima.

## Funcionalidade 2: Admin - Adicionar e remover lojas

### Regras de negocio

- Apenas area administrativa pode criar ou remover lojas.
- Campos obrigatorios para criar loja: nome, endereco e identificador unico.
- Nao pode existir duplicidade de loja com o mesmo identificador.
- Ao remover uma loja existente, ela deve deixar de aparecer na listagem publica.

### Casos de teste

3. CT-ADMIN-LOJAS-01 (Unitario) - Positivo

- Cenario: validacao dos dados da loja antes do cadastro.
- Entrada: payload com nome, endereco e identificador valido.
- Resultado esperado: funcao de validacao retorna sucesso e permite persistencia.

4. CT-ADMIN-LOJAS-02 (Integracao) - Negativo

- Cenario: tentativa de cadastro de loja com identificador ja existente.
- Entrada: payload com identificador duplicado.
- Resultado esperado: endpoint administrativo retorna erro de regra de negocio (ex.: 409/400) e nao cria nova loja.

## Funcionalidade 3: Admin - Movimentacao de estoque

### Regras de negocio

- Entradas de estoque aumentam a quantidade do item.
- Saidas de estoque diminuem a quantidade do item.
- O estoque nao pode ficar negativo.
- Toda movimentacao deve ficar registrada com tipo (entrada/saida), quantidade e data.

### Casos de teste

5. CT-ESTOQUE-01 (Unitario) - Positivo

- Cenario: aplicacao da regra de entrada de estoque.
- Entrada: item com quantidade atual 10 e movimentacao de entrada +5.
- Resultado esperado: quantidade final do item igual a 15.

6. CT-ESTOQUE-02 (E2E) - Negativo

- Cenario: admin tenta registrar saida maior que o saldo disponivel.
- Entrada: item com saldo 3 e requisicao de saida 8.
- Resultado esperado: sistema bloqueia operacao, exibe mensagem de erro e mantem saldo 3.

## Resumo de cobertura

- Total de funcionalidades: 3
- Total de casos de teste: 6
- Classificacoes usadas: Unitario, Integracao e E2E
