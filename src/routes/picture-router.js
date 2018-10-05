'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const HttpError = require('http-errors');
const Picture = require('../model/picture');
const bearerAuthMiddleware = require('../lib/bearer-auth-middleware');

const jsonParser = bodyParser.json();
const router = module.exports = new express.Router();

// -----POST ROUTE----------------------------------------------------------------------------------
router.post('/api/picture', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'Bad Request'));
  }
  return new Picture({
    ...request.body,
    account: request.account._id,
  }).save()
    .then(picture => response.json(picture))
    .catch(next);
});

// -----GET ROUTE----------------------------------------------------------------------------------
router.get('/api/picture/:id', bearerAuthMiddleware, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'Bad Request'));
  }
  return Picture.findById(request.params.id)
    .then((picture) => {
      if (picture) {
        return response.json(picture);
      }
      return next(new HttpError(404, 'Picture Not Found'));
    })
    .catch(next);
});

// -----PUT ROUTE-----------------------------------------------------------------------------------
router.put('/api/picture/:id', bearerAuthMiddleware, jsonParser, (request, response, next) => {
  if (!request.account) {
    return next(new HttpError(400, 'Bad Request'));
  }
  return Picture.findById(request.params.id)
    .then((picture) => {
      if (!request.body) {
        throw HttpError(400, 'body is required');
      }
      if (!picture) {
        throw HttpError(404, 'picture not found');
      }
      if (request.body.title) {
        picture.set({
          title: `${request.body.title}`,
        });
      }
      if (request.body.content) {
        picture.set({
          content: `${request.body.content}`,
        });
      }
      return picture.save()
        .then(updatedGroceryList => response.json(updatedGroceryList))
        .catch(next);
    })
    .catch(next);
});
