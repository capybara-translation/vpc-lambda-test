'use strict';
const axios = require('axios');

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
