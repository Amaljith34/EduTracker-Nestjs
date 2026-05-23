import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SubjectCatalogDocument } from 'src/database/schema/subject-catalog.schema';
import { SubjectCatalogRepository } from 'src/database/repositories/subject-catalog.repository';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private readonly subjectRepository: SubjectCatalogRepository) {}

  async create(dto: CreateSubjectDto) {
    const existing = await this.subjectRepository.findByNameNormalized(dto.subjectName);
    if (existing) {
      throw new ConflictException(
        `Subject "${dto.subjectName.trim()}" already exists`,
      );
    }

    const subject = await this.subjectRepository.create({
      subjectName: dto.subjectName,
      status: dto.status,
    });
    return this.toResponse(subject);
  }

  async findAll(status?: string) {
    const filter = status ? { status } : {};
    const subjects = await this.subjectRepository.findAll(filter);
    return subjects.map((s) => this.toResponse(s));
  }

  async findOne(id: string) {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) throw new NotFoundException('Subject not found');
    return this.toResponse(subject);
  }

  async update(id: string, dto: UpdateSubjectDto) {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) throw new NotFoundException('Subject not found');

    if (dto.subjectName) {
      const duplicate = await this.subjectRepository.findByNameNormalized(dto.subjectName);
      if (duplicate && duplicate._id.toString() !== id) {
        throw new ConflictException(
          `Subject "${dto.subjectName.trim()}" already exists`,
        );
      }
    }

    const updated = await this.subjectRepository.updateById(id, dto);
    return this.toResponse(updated!);
  }

  async remove(id: string) {
    const subject = await this.subjectRepository.findById(id);
    if (!subject) throw new NotFoundException('Subject not found');
    await this.subjectRepository.deleteById(id);
    return { message: 'Subject deleted successfully' };
  }

  private toResponse(subject: SubjectCatalogDocument) {
    return {
      subjectId: subject._id.toString(),
      subjectName: this.displayName(subject.subjectName),
      status: subject.status,
      createdAt: (subject as { createdAt?: Date }).createdAt,
      updatedAt: (subject as { updatedAt?: Date }).updatedAt,
    };
  }

  /** Stored lowercase; display with first letter capitalized per word */
  private displayName(name: string) {
    return name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
