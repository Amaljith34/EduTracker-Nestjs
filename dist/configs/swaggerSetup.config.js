"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.swaggerCustomOption = exports.swaggerConfig = void 0;
const swagger_1 = require("@nestjs/swagger");
const pkg = require('../../package.json');
exports.swaggerConfig = new swagger_1.DocumentBuilder()
    .setTitle('Intern Tracker API')
    .setDescription(`Intern tracker APIs running in ${process.env.STAGE?.toUpperCase() ?? 'DEV'} at PORT ${process.env.PORT ?? 4000}.`)
    .setVersion(`v${pkg.version}`)
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'Token')
    .build();
exports.swaggerCustomOption = {
    swaggerOptions: {
        persistAuthorization: true,
    },
    customSiteTitle: 'Intern Tracker API Docs',
};
//# sourceMappingURL=swaggerSetup.config.js.map