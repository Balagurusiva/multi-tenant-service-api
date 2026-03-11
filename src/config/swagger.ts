import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Multi-Tenant Service API',
            version: '1.0.0',
            description: 'API documentation for the Multi-Tenant Service',
        },
        servers: [
            {
                url: `http://localhost:${PORT}/api/v1`,
                description: 'Development server',
            },
        ],
    },
    // This tells Swagger to scan all route files for documentation comments
    apis: [
        "./src/doc/*.yml",
        './src/modules/**/*.routes.ts',
        './src/app.ts'
    ],
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app: Application) => {
    // This exposes the interactive UI at the /api-docs endpoint
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`📄 Swagger Docs available at http://localhost:${PORT}/api/v1`);
};