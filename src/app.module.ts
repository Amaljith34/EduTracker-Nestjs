import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { EnvironmentSchemaConfig } from './configs/environment-schema.config';
import { MongooseConfig } from './configs/mongoose.config';
import { AuthModule } from './api/auth/auth.module';
import { ReviewsModule } from './api/reviews/reviews.module';
import { AnalyticsModule } from './api/analytics/analytics.module';
import { UsersModule } from './api/users/users.module';
import { SubscribersModule } from './api/subscribers/subscribers.module';
import { TransactionsModule } from './api/transactions/transactions.module';
import { DashboardModule } from './api/dashboard/dashboard.module';
import { SubjectsModule } from './api/subjects/subjects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env'],
      validationSchema: EnvironmentSchemaConfig,
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
          throw new Error('JWT_SECRET is missing. Add it to your .env file.');
        }
        return {
          secret,
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '15m',
          },
        };
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: MongooseConfig,
    }),
    AuthModule,
    UsersModule,
    SubscribersModule,
    ReviewsModule,
    TransactionsModule,
    DashboardModule,
    AnalyticsModule,
    SubjectsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
