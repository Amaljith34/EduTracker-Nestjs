"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const mongoose_1 = require("@nestjs/mongoose");
const environment_schema_config_1 = require("./configs/environment-schema.config");
const mongoose_config_1 = require("./configs/mongoose.config");
const auth_module_1 = require("./api/auth/auth.module");
const reviews_module_1 = require("./api/reviews/reviews.module");
const analytics_module_1 = require("./api/analytics/analytics.module");
const user_module_1 = require("./api/user/user.module");
const subscribers_module_1 = require("./api/subscribers/subscribers.module");
const transactions_module_1 = require("./api/transactions/transactions.module");
const dashboard_module_1 = require("./api/dashboard/dashboard.module");
const subjects_module_1 = require("./api/subjects/subjects.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                envFilePath: ['.env'],
                validationSchema: environment_schema_config_1.EnvironmentSchemaConfig,
                isGlobal: true,
            }),
            jwt_1.JwtModule.registerAsync({
                global: true,
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => {
                    const secret = configService.get('JWT_SECRET');
                    if (!secret) {
                        throw new Error('JWT_SECRET is missing. Add it to your .env file.');
                    }
                    return {
                        secret,
                        signOptions: {
                            expiresIn: configService.get('JWT_EXPIRES_IN') || '15m',
                        },
                    };
                },
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useClass: mongoose_config_1.MongooseConfig,
            }),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            subscribers_module_1.SubscribersModule,
            reviews_module_1.ReviewsModule,
            transactions_module_1.TransactionsModule,
            dashboard_module_1.DashboardModule,
            analytics_module_1.AnalyticsModule,
            subjects_module_1.SubjectsModule,
        ],
        controllers: [],
        providers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map