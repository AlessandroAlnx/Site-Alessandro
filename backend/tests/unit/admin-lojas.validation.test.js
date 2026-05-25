const request = require('supertest');
const { createApp } = require('../../src/app');

describe('CT-ADMIN-LOJAS-01 - validacao antes do cadastro', () => {
  it('deve permitir cadastro de loja com payload valido', async () => {
    const app = createApp();

    const payload = {
      nome: 'MERKATU Teste',
      endereco: 'Rua de Teste, 123',
      latitude: -27.6,
      longitude: -48.5,
      telefone: '(48) 9999-0000'
    };

    const response = await request(app)
      .post('/api/lojas')
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({
        nome: payload.nome,
        endereco: payload.endereco,
        latitude: payload.latitude,
        longitude: payload.longitude,
        telefone: payload.telefone,
        ativo: true
      })
    );
  });

  it('deve rejeitar cadastro sem campos obrigatorios', async () => {
    const app = createApp();

    const response = await request(app)
      .post('/api/lojas')
      .send({ nome: 'Loja Invalida' });

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('erro');
  });
});
