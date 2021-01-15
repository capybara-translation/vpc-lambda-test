'use strict';
const axios = require('axios');
const MongoClient = require('mongodb').MongoClient;
const MONGODB_URI = process.env.MONGODB_URI; // or Atlas connection string
const MONGODB_NAME = process.env.MONGODB_NAME; // or Atlas connection string

let cachedDb = null;

function connectToDatabase(uri) {
  console.log('=> connect to database');
  if (cachedDb) {
    console.log('=> using cached database instance');
    return Promise.resolve(cachedDb);
  }

  const options = {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  };
  const client = new MongoClient(uri, options);

  return client.connect().then((client) => {
    cachedDb = client.db(MONGODB_NAME);
    return cachedDb;
  });
}

module.exports.getIpAddress = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ipAddress: event.requestContext.identity.sourceIp,
    }),
  };
};

module.exports.testIpAddress = async (event) => {
  console.log('API_ENDPOINT:', process.env.API_ENDPOINT);
  const response = await axios.get(`${process.env.API_ENDPOINT}/getIpAddress`, {
    headers: {
      'x-api-key': event.requestContext.identity.apiKey,
    },
  });
  return {
    statusCode: 200,
    body: JSON.stringify(response.data),
  };
};

module.exports.testMongo = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log('event: ', event);

  const db = await connectToDatabase(MONGODB_URI);

  await db.collection('items').insertOne({ name: 'hoge' });
  console.log('insertOne');

  const item = await db.collection('items').findOne({ name: 'hoge' });
  console.log('findOne');

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};

module.exports.testMongoFail = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log('event: ', event);

  const db = await connectToDatabase(MONGODB_URI);

  await db.collection('items').insertOne({ name: 'hoge' });
  console.log('insertOne');

  const item = await db.collection('items').findOne({ name: 'hoge' });
  console.log('findOne');

  return {
    statusCode: 200,
    body: JSON.stringify(item),
  };
};
