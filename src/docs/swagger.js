const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Analytics API',
      version: '1.0.0',
      description: 'API documentation for Analytics app',
    },
    servers: [{ url: 'http://18.207.167.3:8080' }],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'api-key',
        },
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          properties: {
            appName: { type: 'string', example: 'MyAnalyticsClient' },
            ownerEmail: { type: 'string', example: 'user@example.com' },
          },
          required: ['appName', 'ownerEmail'],
        },
        RegisterResponse: {
          type: 'object',
          properties: {
            appId: { type: 'string', example: '77f000c2-7ad7-4c96-b35b-6dd32a8c22f2' },
            apiKey: { type: 'string', example: '36850e1fa5d9dc5090abad3c7928815379de52cafb84a33d04c470794aac435b' },
            expiresAt: { type: 'string', example: '2025-12-15T06:29:10.226Z' },
          },
        },
        ApiKeyResponse: {
          type: 'object',
          properties: {
            appId: { type: 'string', example: '21771a9e-7e85-4b33-a949-b08c91bcc04a' },
            appName: { type: 'string', example: 'MyAnalyticsClient' },
            ownerEmail: { type: 'string', example: 'user@example.com' },
          },
        },
        RevokeRequest: {
          type: 'object',
          properties: { appId: { type: 'string', example: 'ba154742-cfa2-407a-915e-d7480793502c' } },
          required: ['appId'],
        },
        CollectEventRequest: {
          type: 'object',
          properties: {
            event: { type: 'string', example: 'login_form_cta_click' },
            url: { type: 'string', example: 'https://example.com/page' },
            referrer: { type: 'string', example: 'https://google.com' },
            device: { type: 'string', example: 'mobile' },
            ipAddress: { type: 'string', example: '127.0.0.1' },
            timestamp: { type: 'string', example: '2024-02-20T12:34:56Z' },
            metadata: {
              type: 'object',
              properties: {
                browser: { type: 'string', example: 'Chrome' },
                os: { type: 'string', example: 'Android' },
                screenSize: { type: 'string', example: '1080x1920' },
              },
            },
          },
          required: ['event', 'timestamp'],
        },
        EventSummaryResponse: {
          type: 'object',
          properties: {
            event: { type: 'string', example: 'click' },
            count: { type: 'integer', example: 3400 },
            uniqueUsers: { type: 'integer', example: 1200 },
            deviceData: { type: 'object', example: { mobile: 2200, desktop: 1200 } },
          },
        },
        UserStatsResponse: {
          type: 'object',
          properties: {
            userId: { type: 'string', example: 'user789' },
            totalEvents: { type: 'integer', example: 150 },
            deviceDetails: { type: 'object', example: { browser: 'Chrome', os: 'Android' } },
            ipAddress: { type: 'string', example: '192.168.1.1' },
          },
        },
      },
    },
    security: [], 
  },
  apis: [],
};

// Paths
options.definition.paths = {
  '/api/auth/register': {
    post: {
      summary: 'Register new app and generate API key',
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } } },
      responses: { 200: { description: 'API key generated', content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterResponse' } } } } },
    },
  },
  '/api/auth/api-key': {
    get: {
      summary: 'Retrieve API key info for a registered app',
      security: [{ ApiKeyAuth: [] }],
      parameters: [{ name: 'api-key', in: 'header', required: true, schema: { type: 'string' }, description: 'API key from register API' }],
      responses: { 200: { description: 'API key details', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiKeyResponse' } } } } },
    },
  },
  '/api/auth/revoke': {
    post: {
      summary: 'Revoke an API key',
      security: [{ ApiKeyAuth: [] }],
      parameters: [{ name: 'api-key', in: 'header', required: true, schema: { type: 'string' }, description: 'API key from register API' }],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RevokeRequest' } } } },
      responses: { 200: { description: 'API key revoked', content: { 'application/json': { example: { ok: true } } } } },
    },
  },
  '/api/analytics/collect': {
    post: {
      summary: 'Collect an event',
      security: [{ ApiKeyAuth: [] }],
      parameters: [{ name: 'api-key', in: 'header', required: true, schema: { type: 'string' }, description: 'API key from register API' }],
      requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CollectEventRequest' } } } },
      responses: { 200: { description: 'Event collected', content: { 'application/json': { example: { ok: true } } } } },
    },
  },
  '/api/analytics/event-summary': {
    get: {
      summary: 'Get analytics summary for a specific event',
      security: [{ ApiKeyAuth: [] }],
      parameters: [
        { name: 'api-key', in: 'header', required: true, schema: { type: 'string' }, description: 'API key from register API' },
        { name: 'event', in: 'query', required: true, schema: { type: 'string' } },
        { name: 'startDate', in: 'query', schema: { type: 'string', format: 'date' } },
        { name: 'endDate', in: 'query', schema: { type: 'string', format: 'date' } },
        { name: 'app_id', in: 'query', schema: { type: 'string' } },
      ],
      responses: { 200: { description: 'Event summary', content: { 'application/json': { schema: { $ref: '#/components/schemas/EventSummaryResponse' } } } } },
    },
  },
  '/api/analytics/user-stats': {
    get: {
      summary: 'Get stats for a specific user',
      security: [{ ApiKeyAuth: [] }],
      parameters: [
        { name: 'api-key', in: 'header', required: true, schema: { type: 'string' }, description: 'API key from register API' },
        { name: 'userId', in: 'query', required: true, schema: { type: 'string' } },
      ],
      responses: { 200: { description: 'User stats', content: { 'application/json': { schema: { $ref: '#/components/schemas/UserStatsResponse' } } } } },
    },
  },
};

const swaggerSpec = swaggerJsdoc(options);
module.exports = swaggerSpec;
