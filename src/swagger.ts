import swaggerJsdoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Dreamestate API",
    version: "1.0.0",
    description: "Documentation for Dreamestate API",
  },
  servers: [
    {
      url: "http://localhost:9000/api/v1",
      description: "Local server",
    },
  ],
  components: {
    securitySchemes: {
      AdminAuth: {
        type: "apiKey",
        in: "header",
        name: "Authorization",
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./src/app/**/*.swagger.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
