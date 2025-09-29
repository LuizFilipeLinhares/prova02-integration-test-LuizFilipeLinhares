/*import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

describe('Simple API validation', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://apichallenges.eviltester.com/simpleapi';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  const generateIsbn13 = () => {
    const segment1 = faker.number.int({ min: 100, max: 999 });
    const segment2 = faker.number.int({ min: 0, max: 9 });
    const segment3 = faker.number.int({ min: 10, max: 99 });
    const segment4 = faker.number.int({ min: 100000, max: 999999 });
    const segment5 = faker.number.int({ min: 0, max: 9 });

    return `${segment1}-${segment2}-${segment3}-${segment4}-${segment5}`;
  };

  describe('Verificando o método GET para um item específico', () => {
    it('Deve retornar um item com id 6', async () => {
      const itemId = 6;

      await p
        .spec()
        .get(`${baseUrl}/items/${itemId}`)
        .expectStatus(StatusCodes.OK)
    });
  });

  describe('Verificando PUT para atualizar um item', () => {
    it('Deve alterar um item de id 7', async () => {
      const updatedItem = {
        type: 'dvd',
        isbn13: '152-7-65-672400-8',
        price: 20.0,
        numberinstock: 10
      };

      await p
        .spec()
        .put(`${baseUrl}/items/7`)
        .withJson(updatedItem)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: 7,
          type: 'dvd',
          isbn13: '152-7-65-672400-8',
          price: 20.0,
          numberinstock: 10
        });
    });
  });

  describe('Criando um novo item com o método POST', () => {
    it('Deve criar um novo item', async () => {
      const isbn13 = generateIsbn13();

      const newItem = {
        type: 'cd',
        isbn13: isbn13,
        price: 70.0,
        numberinstock: 20
      };

      const response = await p
        .spec()
        .post(`${baseUrl}/items`)
        .withJson(newItem)
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          type: 'cd',
          isbn13: isbn13,
          price: 70.0,
          numberinstock: 20
        });

      console.log('Item criado com sucesso!', response.body); 
    });
  });

  describe('Verificando o método DELETE', () => {
    it('Deve deletar um item', async () => {
      const isbn13 = generateIsbn13();

      const newItem = {
        type: 'cd',
        isbn13: isbn13,
        price: 70.0,
        numberinstock: 20
      };

    
      const createResponse = await p
        .spec()
        .post(`${baseUrl}/items`)
        .withJson(newItem)
        .expectStatus(StatusCodes.CREATED);

      const itemId = createResponse.body.id; 

     
      await p
        .spec()
        .delete(`${baseUrl}/items/${itemId}`)
        .expectStatus(StatusCodes.OK);

   
      await p
        .spec()
        .get(`${baseUrl}/items/${itemId}`)
        .expectStatus(StatusCodes.NOT_FOUND); 
    });
  });
});*/
