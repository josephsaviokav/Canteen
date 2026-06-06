import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Canteen API',
    version: '1.0.0',
    description: 'REST API for Canteen Management System',
    contact: {
      name: 'API Support',
      email: 'support@canteen.com',
    },
    license: {
      name: 'MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
    {
      url: process.env.PRODUCTION_URL || 'https://your-production-url.com',
      description: 'Production server',
    },
  ],
  tags: [
    { name: 'Auth', description: 'Authentication endpoints' },
    { name: 'Users', description: 'User management' },
    { name: 'Items', description: 'Item/Menu management' },
    { name: 'Categories', description: 'Category management' },
    { name: 'Cart', description: 'Shopping cart operations' },
    { name: 'Orders', description: 'Order management' },
    { name: 'Payments', description: 'Payment processing' },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'JWT Bearer token authentication',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          userId: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string', enum: ['user', 'admin'] },
          phone: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['userId', 'email', 'role'],
      },
      Item: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'number', format: 'decimal' },
          categoryId: { type: 'string', format: 'uuid' },
          imageUrl: { type: 'string', format: 'uri' },
          available: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name', 'price', 'categoryId'],
      },
      Category: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string' },
          description: { type: 'string' },
          imageUrl: { type: 'string', format: 'uri' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'name'],
      },
      Cart: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/CartItem' },
          },
          totalAmount: { type: 'number', format: 'decimal' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'userId'],
      },
      CartItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          cartId: { type: 'string', format: 'uuid' },
          itemId: { type: 'string', format: 'uuid' },
          quantity: { type: 'integer', minimum: 1 },
          price: { type: 'number', format: 'decimal' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'cartId', 'itemId', 'quantity', 'price'],
      },
      Order: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          totalAmount: { type: 'number', format: 'decimal' },
          status: {
            type: 'string',
            enum: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled'],
          },
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/OrderItem' },
          },
          deliveryAddress: { type: 'string' },
          notes: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'userId', 'totalAmount', 'status'],
      },
      OrderItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          orderId: { type: 'string', format: 'uuid' },
          itemId: { type: 'string', format: 'uuid' },
          quantity: { type: 'integer', minimum: 1 },
          price: { type: 'number', format: 'decimal' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'orderId', 'itemId', 'quantity', 'price'],
      },
      Payment: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          orderId: { type: 'string', format: 'uuid' },
          amount: { type: 'number', format: 'decimal' },
          status: { type: 'string', enum: ['pending', 'completed', 'failed'] },
          paymentMethod: { type: 'string', enum: ['card', 'upi', 'netbanking'] },
          transactionId: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
        required: ['id', 'orderId', 'amount', 'status'],
      },
      ApiResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean' },
          message: { type: 'string' },
          data: { type: 'object' },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          message: { type: 'string' },
          error: { type: 'string' },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    './src/modules/*/routes.ts',
    './src/modules/user/*.ts',
    './src/modules/item/*.ts',
    './src/modules/category/*.ts',
    './src/modules/cart/*.ts',
    './src/modules/order/*.ts',
    './src/modules/payment/*.ts',
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
