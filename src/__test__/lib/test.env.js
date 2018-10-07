'use strict';

const awsSDKMock = require('aws-sdk-mock');
const faker = require('faker');

process.env.PORT = 4000;
process.env.MONGODB_URI = 'mongodb://localhost/testdb';
process.env.SECRET = '3MHP2lXTIr8aI6VeErb866WvZfehCftsLdInhM6MEtSNKd4SHd3lRdCJ2GFA8bMvOXttrvsupXvthaM36PUTsYw5jIECoOiDZwHl';
process.env.AWS_ACCESS_KEY_ID = 'SECRET ID';
process.env.AWS_SECRET_ACCESS_KEY = 'SECRET INFORMATION';
process.env.AWS_BUCKET = 'test-bucket';

awsSDKMock.mock('S3', 'upload', (params, callback) => {
  if (!params.Key || !params.Bucket || !params.Body || !params.ACL) {
    return callback(new Error('ERROR', 'Missing arguments in the upload request'));
  }

  if (params.ACL !== 'public-read') {
    return callback(new Error('ERROR', 'ACL should be "public-read"'));
  }

  if (params.Bucket !== process.env.AWS_BUCKET) {
    return callback(new Error('ERROR', 'incorrect Bucket'));
  }

  return callback(null, { Location: faker.internet.url() });
});
