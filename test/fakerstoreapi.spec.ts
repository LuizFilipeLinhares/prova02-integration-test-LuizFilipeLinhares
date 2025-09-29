import pactum from 'pactum';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('FakeStoreAPI – Testes de Integração com PactumJS', () => {
  const p = pactum;
  const baseUrl = 'https://fakestoreapi.com';

  beforeAll(() => {
    p.reporter.add(SimpleReporter);
    p.request.setDefaultTimeout(30000);
  });

  afterAll(() => p.reporter.end());

  
  describe('Products', () => {
    it('GET /products/:id - Deve retornar um produto específico', async () => {
      await p
        .spec()
        .get(`${baseUrl}/products/1`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({ id: 1 });
    });

    it('PUT /products/:id - Deve atualizar um produto existente', async () => {
      const updatedProduct = {
        title: 'Produto Atualizado',
        price: 199.99,
        description: 'Descrição atualizada',
        image: 'https://i.pravatar.cc',
        category: 'jewelery'
      };

      await p
        .spec()
        .put(`${baseUrl}/products/1`)
        .withJson(updatedProduct)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          title: updatedProduct.title,
          price: updatedProduct.price
        });
    });
  });

  describe('Users', () => {
    it('GET /users/:id - Deve retornar um usuário', async () => {
      await p
        .spec()
        .get(`${baseUrl}/users/1`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({ id: 1 });
    });

    it('POST /users - Deve criar um novo usuário', async () => {
      const newUser = {
        email: "l10test@test.com",
        username: "l10test",
        password: faker.internet.password(),
        name: {
          firstname: faker.person.firstName(),   
          lastname: faker.person.lastName()
        },
        address: {
          city: faker.location.city(),
          street: faker.location.street(),      
          number: faker.number.int({ min: 1, max: 125 }),
          zipcode: faker.location.zipCode(),
          geolocation: {
            lat: faker.location.latitude(),
            long: faker.location.longitude()
          }
        },
        phone: faker.phone.number()
      };

      await p
        .spec()
        .post(`${baseUrl}/users`)
        .withJson(newUser)
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          id: /\d+/
        });
    });

    it('PUT /users/:id - Deve atualizar um usuário', async () => {
      const updatedUser = {
        email: faker.internet.email(),
        username: 'usuario_atualizado',
        password: 'nova_senha',
        name: {
          firstname: 'Atualizado',
          lastname: 'Usuario'
        },
        address: {
          city: 'Nova Cidade',
          street: 'Rua Nova',
          number: 222,
          zipcode: '12345-678',
          geolocation: {
            lat: '40.0',
            long: '20.0'
          }
        },
        phone: '123456789'
      };

      await p
        .spec()
        .put(`${baseUrl}/users/1`)
        .withJson(updatedUser)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          username: updatedUser.username,
          email: updatedUser.email
        });
    });
  });

  describe('Carts', () => {
    it('GET - Deve retornar um carrinho específico', async () => {
      await p
        .spec()
        .get(`${baseUrl}/carts/1`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({ id: 1 });
    });

    it('POST - Deve criar um novo carrinho', async () => {
      const newCart = {
        userId: 1,
        date: new Date().toISOString(),
        products: [
          { productId: 1, quantity: 2 },
          { productId: 2, quantity: 1 }
        ]
      };

      await p
        .spec()
        .post(`${baseUrl}/carts`)
        .withJson(newCart)
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          userId: newCart.userId
        });
    });

    it('PUT - Deve atualizar um carrinho', async () => {
      const updatedCart = {
        userId: 1,
        date: new Date().toISOString(),
        products: [
          { productId: 3, quantity: 5 }
        ]
      };

      await p
        .spec()
        .put(`${baseUrl}/carts/1`)
        .withJson(updatedCart)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          userId: updatedCart.userId
        });
    });
  });

  describe('Auth (login)', () => {
    it('Deve retornar token com credenciais válidas', async () => {
      const loginPayload = {
        username: 'mor_2314',
        password: '83r5^_'
      };

      await p
        .spec()
        .post(`${baseUrl}/auth/login`)
        .withJson(loginPayload)
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({ token: /\w+/ });
    });

    it('POST Deve falhar com credenciais inválidas', async () => {
      const loginPayload = {
        username: 'usuario_invalido',
        password: 'senha_errada'
      };

      await p
        .spec()
        .post(`${baseUrl}/auth/login`)
        .withJson(loginPayload)
        .expectStatus(StatusCodes.UNAUTHORIZED);
    });
  });
});
