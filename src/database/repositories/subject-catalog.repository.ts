import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import {
  SubjectCatalog,
  SubjectCatalogDocument,
  SubjectStatus,
} from '../schema/subject-catalog.schema';

@Injectable()
export class SubjectCatalogRepository {
  constructor(
    @InjectModel(SubjectCatalog.name)
    private readonly subjectModel: Model<SubjectCatalogDocument>,
  ) {}

  findByNameNormalized(subjectName: string) {
    const normalized = subjectName.trim().toLowerCase();
    return this.subjectModel.findOne({ subjectName: normalized });
  }

  create(data: Partial<SubjectCatalog>) {
    return this.subjectModel.create({
      ...data,
      subjectName: data.subjectName!.trim().toLowerCase(),
    });
  }

  findAll(filter: FilterQuery<SubjectCatalogDocument> = {}) {
    return this.subjectModel.find(filter).sort({ subjectName: 1 });
  }

  findById(id: string) {
    return this.subjectModel.findById(id);
  }

  updateById(id: string, data: Partial<SubjectCatalog>) {
    const update = { ...data };
    if (data.subjectName) {
      update.subjectName = data.subjectName.trim().toLowerCase();
    }
    return this.subjectModel.findByIdAndUpdate(id, update, { new: true });
  }

  deleteById(id: string) {
    return this.subjectModel.findByIdAndDelete(id);
  }

  countActive() {
    return this.subjectModel.countDocuments({ status: SubjectStatus.ACTIVE });
  }
}
