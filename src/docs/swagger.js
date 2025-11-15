const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: { title: 'Analytics API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:8081' }]
  },
  apis: ['./src/routes/*.js','./src/controllers/*.js']
};

module.exports = swaggerJsdoc(options);
