import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseConfig implements MongooseOptionsFactory {
  @Inject(ConfigService)
  private readonly configService: ConfigService;

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: this.configService.get<string>('DB_URI'),
      ssl: this.configService.get('STAGE') === 'Dev',
    };
  }
}
