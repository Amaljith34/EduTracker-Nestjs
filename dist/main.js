"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const log_helper_1 = require("./utils/helper/functions/log-helper");
(0, log_helper_1.devLog)('Global crypto:', typeof crypto !== 'undefined' ? 'Available' : 'NOT DEFINED');
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const swaggerSetup_config_1 = require("./configs/swaggerSetup.config");
const request_logging_interceptor_1 = require("./common/logging/request-logging.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
async function bootstrap() {
    try {
        const logger = new common_1.Logger('Bootstrap');
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.setGlobalPrefix('api');
        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            process.env.MOBILE_URL || 'http://localhost:8081',
        ].filter(Boolean);
        app.enableCors({
            origin: allowedOrigins,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        });
        app.useGlobalPipes(new common_1.ValidationPipe({ transform: true }));
        app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
        app.useGlobalInterceptors(new request_logging_interceptor_1.RequestLoggingInterceptor());
        if (process.env.LOG_LEVEL === 'production') {
            console.log = () => { };
            console.warn = () => { };
            console.debug = () => { };
        }
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerSetup_config_1.swaggerConfig);
        swagger_1.SwaggerModule.setup('api-docs', app, document, swaggerSetup_config_1.swaggerCustomOption);
        const port = process.env.PORT || 4000;
        await app.listen(port);
        logger.log(`Server running at PORT: ${port} in ${process.env.STAGE ?? 'Dev'} stage`);
    }
    catch (error) {
        console.error('Error starting the server:', error);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map