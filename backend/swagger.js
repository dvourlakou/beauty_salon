const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openApi: '3.0.0',
        info: {
            title: 'Beauty Salon API',
            version: '1.0.0',
            description: 'API documentation fot the BeautySalon Management System',
        },
        servers: [
            {
                url: `http:localhost:${process.env.PORT || 5000}`,
                description: 'Development server',
            },
        ],
    },
    apis: ['./route/*.js', './controllers/*.js'],
};

const specs = swaggerJsdoc(options);
module.exports = specs;