import pactum from 'pactum';
import { SimpleReporter } from '../simple-reporter';
import { faker } from '@faker-js/faker';
import { StatusCodes } from 'http-status-codes';

describe('TheTestRequest API validation', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://thetestrequest.com';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  // utilitário para gerar dados fake para author / article / comment
  const makeAuthorData = () => ({
    author: {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      avatar: faker.image.urlPicsumPhotos({ width: 100, height: 100 })
    }
  });

  const makeArticleData = () => ({
    article: {
      title: faker.lorem.sentence(),
      body: faker.lorem.paragraph(),
      views: faker.number.int({ min: 0, max: 1000 }),
      likes: faker.number.int({ min: 0, max: 1000 })
    }
  });

  const makeCommentData = () => ({
    comment: {
      body: faker.lorem.sentences(2),
      written_by: faker.person.fullName()
    }
  });

  describe('Authors', () => {
    it('GET /authors deve retornar lista de autores', async () => {
      await p
        .spec()
        .get(`${baseUrl}/authors`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike([{
          id: p.types.number(),
          name: p.types.string(),
          email: p.types.string()
        }]);
    });

    it('GET /authors/:id deve retornar um autor específico', async () => {
      const authorId = 1;
      await p
        .spec()
        .get(`${baseUrl}/authors/${authorId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonMatch({
          id: authorId
        });
    });

    it('POST /authors deve “criar” um autor (fake)', async () => {
      const newAuthor = makeAuthorData();
      const res = await p
        .spec()
        .post(`${baseUrl}/authors`)
        .withJson(newAuthor)
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          author: {
            name: newAuthor.author.name,
            email: newAuthor.author.email,
            avatar: newAuthor.author.avatar
          }
        });
      console.log('Autor criado (fake):', res.body);
    });

    it('PUT /authors/:id deve “atualizar” um autor (fake)', async () => {
      const authorId = 2;
      const updated = makeAuthorData();
      await p
        .spec()
        .put(`${baseUrl}/authors/${authorId}`)
        .withJson(updated)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          author: {
            name: updated.author.name,
            email: updated.author.email,
            avatar: updated.author.avatar
          }
        });
    });

    it('DELETE /authors/:id deve “deletar” (fake)', async () => {
      const authorId = 3;
      await p
        .spec()
        .delete(`${baseUrl}/authors/${authorId}`)
        .expectStatus(StatusCodes.OK);
    });
  });

  describe('Articles', () => {
    it('GET /articles deve retornar lista de artigos', async () => {
      await p
        .spec()
        .get(`${baseUrl}/articles`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike([{
          id: p.types.number(),
          title: p.types.string(),
          body: p.types.string()
        }]);
    });

    it('GET /authors/:id/articles deve retornar artigos de um autor', async () => {
      const authorId = 1;
      await p
        .spec()
        .get(`${baseUrl}/authors/${authorId}/articles`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike([{
          id: p.types.number(),
          title: p.types.string(),
          body: p.types.string(),
          author_id: authorId
        }]);
    });

    it('GET /authors/:aid/articles/:id deve retornar artigo específico', async () => {
      const authorId = 1;
      const articleId = 1;
      await p
        .spec()
        .get(`${baseUrl}/authors/${authorId}/articles/${articleId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonMatch({
          id: articleId,
          author_id: authorId
        });
    });

    it('POST /authors/:id/articles deve “criar” um artigo (fake)', async () => {
      const authorId = 1;
      const newArticle = makeArticleData();
      const res = await p
        .spec()
        .post(`${baseUrl}/authors/${authorId}/articles`)
        .withJson(newArticle)
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          article: {
            title: newArticle.article.title,
            body: newArticle.article.body
          }
        });
      console.log('Artigo criado (fake):', res.body);
    });

    it('PUT /authors/:aid/articles/:id deve “atualizar” (fake)', async () => {
      const authorId = 1;
      const articleId = 2;
      const updated = makeArticleData();
      await p
        .spec()
        .put(`${baseUrl}/authors/${authorId}/articles/${articleId}`)
        .withJson(updated)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          article: {
            title: updated.article.title,
            body: updated.article.body
          }
        });
    });

    it('DELETE /authors/:aid/articles/:id deve “deletar” (fake)', async () => {
      const authorId = 1;
      const articleId = 3;
      await p
        .spec()
        .delete(`${baseUrl}/authors/${authorId}/articles/${articleId}`)
        .expectStatus(StatusCodes.OK);
    });
  });

  describe('Comments', () => {
    it('GET /articles/:id/comments deve retornar comentários de um artigo', async () => {
      const articleId = 1;
      await p
        .spec()
        .get(`${baseUrl}/articles/${articleId}/comments`)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike([{
          id: p.types.number(),
          body: p.types.string(),
          written_by: p.types.string()
        }]);
    });

    it('GET /articles/:aid/comments/:cid deve retornar comentário específico', async () => {
      const articleId = 1;
      const commentId = 1;
      await p
        .spec()
        .get(`${baseUrl}/articles/${articleId}/comments/${commentId}`)
        .expectStatus(StatusCodes.OK)
        .expectJsonMatch({
          id: commentId,
          article_id: articleId
        });
    });

    it('POST /articles/:id/comments deve “criar” comentário (fake)', async () => {
      const articleId = 1;
      const newComment = makeCommentData();
      const res = await p
        .spec()
        .post(`${baseUrl}/articles/${articleId}/comments`)
        .withJson(newComment)
        .expectStatus(StatusCodes.CREATED)
        .expectJsonLike({
          comment: {
            body: newComment.comment.body,
            written_by: newComment.comment.written_by
          }
        });
      console.log('Comentário criado (fake):', res.body);
    });

    it('PUT /articles/:aid/comments/:cid deve “atualizar” (fake)', async () => {
      const articleId = 1;
      const commentId = 2;
      const updated = makeCommentData();
      await p
        .spec()
        .put(`${baseUrl}/articles/${articleId}/comments/${commentId}`)
        .withJson(updated)
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          comment: {
            body: updated.comment.body,
            written_by: updated.comment.written_by
          }
        });
    });

    it('DELETE /articles/:aid/comments/:cid deve “deletar” (fake)', async () => {
      const articleId = 1;
      const commentId = 3;
      await p
        .spec()
        .delete(`${baseUrl}/articles/${articleId}/comments/${commentId}`)
        .expectStatus(StatusCodes.OK);
    });
  });
});
