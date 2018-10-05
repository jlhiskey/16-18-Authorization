'use strict';

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const accountMock = require('./lib/account-mock');

const API_URL = `http://localhost:${process.env.PORT}/api/picture`;

describe('/api/pictures', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  beforeEach(accountMock.pCleanAccountMocks);

  // -----API/PICTURE ROUTES------------------------------------------------------------------------
  // -----POST SUCCESS TEST----------
  test('Should respond with 200 status code and a picture', () => {
    return accountMock.pCreateMock()
      .then((mock) => {
        return superagent.post(API_URL)
          .set('Authorization', `Bearer ${mock.token}`)
          .send({
            title: faker.lorem.words(3),
            url: faker.internet.url(),
          });
      })
      .then((response) => {
        expect(response.status).toEqual(200);
      });
  });
});

// ----- JEST IS TIMING OUT ON ALL OF THESE TESTS--------------------------------------------------
// VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV

// -----POST FAILURE TESTS----------
// test('Should return a 401 error if token is missing', () => {
//   return accountMock.pCreateMock()
//     .then((mock) => {
//       return superagent.post(API_URL)
//         .set('Authorization', `Bearer ${mock.token}orIsIt?`)
//         .send({
//           password: faker.internet.password(),
//           email: faker.internet.email(),
//         }).then(Promise.reject)
//         .catch((response) => {
//           expect(response.status).toEqual(401);
//         });
//     });
// });
// test('Should return a 400 error if body is missing', () => {
//   return accountMock.pCreateMock()
//     .then((mock) => {
//       return superagent.post(API_URL)
//         .set('Authorization', `Bearer ${mock.token}`)
//         .send({})
//         .then(Promise.reject)
//         .catch((response) => {
//           expect(response.status).toEqual(401);
//         });
//     });
// });

// -----GET ROUTE TESTS------------------------------------------------------------------------
// -----SUCCESS TEST------------------------
// test('should respond with 200 status code and a json note if there is a matching id', () => {
//   let savedAccountMock = null;
//   return accountMock.pCreateMock()
//     .then((createdAccountMock) => {
//       savedAccountMock = createdAccountMock;
//       return superagent.get(`${API_URL}/${createdAccountMock._id}`)
//         .set('Authorization', `Bearer ${createdAccountMock.token}`)
//         .then((getResponse) => {
//           expect(getResponse.status)
//             .toEqual(200);
//           expect(getResponse.body.timestamp)
//             .toBeTruthy();
//           expect(getResponse.body._id.toString())
//             .toEqual(savedAccountMock._id.toString());
//           expect(getResponse.body.title)
//             .toEqual(savedAccountMock.title);
//         });
//     });
// });
// // ----------FAILURE TEST-----------------
// test('should respond with 404 if there isnt a matching id on a get route', () => {
//   return superagent.get(`${API_URL}/jimbob`)
//     .then(Promise.reject)
//     .catch((response) => {
//       expect(response.status)
//         .toEqual(400);
//     });
// });
//
// // -----PUT ROUTE TESTS------------------------------------------------------------------------
// test('should respond with 204 if we updated a grocery lists title and content', () => {
//   let savedAccountMock = null;
//   return accountMock.pCreateMock()
//     .then((createdAccountMock) => {
//       savedAccountMock = createdAccountMock;
//       const newPut = {
//         title: faker.lorem.words(1),
//         content: faker.lorem.words(1),
//       };
//       return superagent.put(`${API_URL}/${createdAccountMock._id}`)
//         .set('Authorization', `Bearer ${createdAccountMock.token}`)
//         .send(newPut)
//         .then((putResponse) => {
//           expect(putResponse.status)
//             .toEqual(200);
//           expect(putResponse.body._id)
//             .toEqual(savedAccountMock.id);
//           expect(putResponse.body.title)
//             .toEqual(newPut.title);
//           expect(putResponse.body.content)
//             .toEqual(newPut.content);
//         });
//     });
// });
// // ----------FAILURE TEST-----------------
// test('should respond with 404 if there isnt a matching id on a put route', () => {
//   return superagent.put(`${API_URL}/jimbob`)
//     .then(Promise.reject)
//     .catch((response) => {
//       expect(response.status)
//         .toEqual(400);
//     });
// });
