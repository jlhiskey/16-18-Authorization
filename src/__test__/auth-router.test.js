'use strict';

const faker = require('faker');
const superagent = require('superagent');
const accountMock = require('./lib/account-mock');
const server = require('../lib/server');

const API_URL = `http://localhost:${process.env.PORT}`;

describe('Auth Router Test Suite', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(accountMock.pCleanAccountMocks);

  // -----API/SIGNUP ROUTES-------------------------------------------------------------------------
  // -----SUCCESS TEST----------
  test('Should return with a 200 status code and a token when a new account is created', () => {
    return superagent.post(`${API_URL}/api/signup`)
      .send({
        username: faker.lorem.words(1),
        password: faker.lorem.words(1),
        email: faker.internet.email(),
      }).then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  // -----FAILURE TESTS----------
  test('Should return a 400 error if username is missing', () => {
    return superagent.post(`${API_URL}/api/signup`)
      .send({
        password: faker.internet.password(),
        email: faker.internet.email(),
      }).then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('Should return a 401 error if password is missing', () => {
    return superagent.post(`${API_URL}/api/signup`)
      .send({
        username: faker.lorem.words(1),
        email: faker.internet.email(),
      }).then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(401);
      });
  });

  test('Should return a 401 error no data was sent', () => {
    return superagent.post(`${API_URL}/api/signup`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(401);
      });
  });
  // -----API/LOGIN ROUTES-------------------------------------------------------------------------
  // -----SUCCESS TEST----------
  test('Should return with a 200 status code and a token if you login to an existing account', () => {
    return accountMock.pCreateMock()
      .then((mock) => {
        return superagent.get(`${API_URL}/api/login`)
          .auth(mock.request.username, mock.request.password);
      })
      .then((response) => {
        expect(response.status).toEqual(200);
        expect(response.body.token).toBeTruthy();
      });
  });
  // -----FAILURE TESTS----------
  test('Should return a 500 if password request does not exist or is not correct', () => {
    return accountMock.pCreateMock()
      .then((mock) => {
        return superagent.get(`${API_URL}/api/login`)
          .auth(mock.request.username, 'password');
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(500);
      });
  });
  test('Should return a 400 if username request does not exist or is not correct', () => {
    return accountMock.pCreateMock()
      .then((mock) => {
        return superagent.get(`${API_URL}/api/login`)
          .auth('JimBob', mock.request.password);
      })
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(400);
      });
  });
  test('Should send a 404 error if the route does not exist', () => {
    return superagent.get(`${API_URL}/salmon/cookies/are/terrible`)
      .then(Promise.reject)
      .catch((response) => {
        expect(response.status).toEqual(404);
      });
  });
});
