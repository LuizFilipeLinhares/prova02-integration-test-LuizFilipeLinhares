const request = require('supertest');

describe('Open Library API', () => {
  it('Deve retornar informações do livro via ISBN', async () => {
    const isbn = '9780140328721'; 
    const url = `https://openlibrary.org/isbn/${isbn}.json`;

    const res = await request(url).get('');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('authors');
  });
});
