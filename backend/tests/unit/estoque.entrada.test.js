describe('CT-ESTOQUE-01 - regra de entrada de estoque', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('deve somar +5 ao saldo 10 e resultar em 15', () => {
    const store = require('../../src/data/memory-store');

    const novoItem = store.createEstoque({
      lojaId: '1',
      loja: 'MERKATU Teste',
      produto: 'Produto Teste',
      quantidade: 10,
      minimo: 1
    });

    const quantidadeFinal = novoItem.quantidade + 5;
    const atualizado = store.updateEstoque(novoItem._id, { quantidade: quantidadeFinal });

    expect(atualizado).not.toBeNull();
    expect(atualizado.quantidade).toBe(15);
  });
});
