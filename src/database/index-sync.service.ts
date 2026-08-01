import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import {
  SubjectCatalog,
  SubjectCatalogDocument,
  SubjectStatus,
} from './schema/subject-catalog.schema';

/**
 * Ensures indexes match the soft-delete / shared-email rules.
 * Drops legacy unique email index so a User may reuse a Subscriber's email.
 */
@Injectable()
export class IndexSyncService implements OnModuleInit {
  private readonly logger = new Logger(IndexSyncService.name);

  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(SubjectCatalog.name)
    private readonly subjectModel: Model<SubjectCatalogDocument>,
  ) {}

  async onModuleInit() {
    try {
      await this.syncUserIndexes();
      await this.syncSubjectIndexes();
    } catch (err) {
      this.logger.warn(`Index sync skipped: ${(err as Error).message}`);
    }
  }

  private async syncUserIndexes() {
    const indexes = await this.userModel.collection.indexes();
    for (const idx of indexes) {
      const key = idx.key as Record<string, number>;
      if (key.email === 1 && idx.unique && Object.keys(key).length === 1) {
        await this.userModel.collection.dropIndex(idx.name!);
        this.logger.log(`Dropped legacy unique email index: ${idx.name}`);
      }
    }
    await this.userModel.collection.createIndex({ email: 1 });
    await this.userModel.collection.createIndex({ phone: 1 });
  }

  private async syncSubjectIndexes() {
    const indexes = await this.subjectModel.collection.indexes();
    for (const idx of indexes) {
      const key = idx.key as Record<string, number>;
      if (key.subjectName === 1 && idx.unique) {
        await this.subjectModel.collection.dropIndex(idx.name!);
        this.logger.log(`Dropped subject unique index: ${idx.name}`);
      }
    }
    await this.subjectModel.collection.createIndex(
      { subjectName: 1 },
      {
        unique: true,
        collation: { locale: 'en', strength: 2 },
        partialFilterExpression: {
          status: { $in: [SubjectStatus.ACTIVE, SubjectStatus.HOLD, SubjectStatus.INACTIVE] },
        },
      },
    );
  }
}
