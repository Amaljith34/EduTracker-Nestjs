import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  SubjectCatalog,
  SubjectCatalogSchema,
} from 'src/database/schema/subject-catalog.schema';
import { SubjectCatalogRepository } from 'src/database/repositories/subject-catalog.repository';
import { AuthModule } from '../auth/auth.module';
import { SubjectsController } from './subjects.controller';
import { SubjectsService } from './subjects.service';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      { name: SubjectCatalog.name, schema: SubjectCatalogSchema },
    ]),
  ],
  controllers: [SubjectsController],
  providers: [SubjectsService, SubjectCatalogRepository],
  exports: [SubjectsService, SubjectCatalogRepository],
})
export class SubjectsModule {}
