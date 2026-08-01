import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import {
  SubjectCatalogDocument,
  SubjectStatus,
} from 'src/database/schema/subject-catalog.schema';
import { SubjectCatalogRepository } from 'src/database/repositories/subject-catalog.repository';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { AuthUserPayload, UserType } from '../auth/auth.type';

@Injectable()
export class SubjectsService {
  constructor(private readonly subjectRepository: SubjectCatalogRepository) {}

  async create(authUser: AuthUserPayload, dto: CreateSubjectDto) {
    const existing = await this.subjectRepository.findByNameNormalized(dto.subjectName);
    if (existing && existing.status !== SubjectStatus.DELETED) {
      throw new ConflictException(
        `Subject "${dto.subjectName.trim()}" already exists`,
      );
    }

    const isSubscriber = authUser.type === UserType.SUBSCRIBER;
    const status = isSubscriber
      ? SubjectStatus.HOLD
      : dto.status || SubjectStatus.ACTIVE;

    const meta = {
      createdBy: new Types.ObjectId(authUser.userId),
      createdByName: authUser.fullName,
      createdByType: authUser.type,
    };

    if (existing && existing.status === SubjectStatus.DELETED) {
      const restored = await this.subjectRepository.updateById(existing._id.toString(), {
        subjectName: dto.subjectName,
        status,
        ...meta,
      });
      return this.toResponse(restored!);
    }

    const subject = await this.subjectRepository.create({
      subjectName: dto.subjectName,
      status,
      ...meta,
    });
    return this.toResponse(subject);
  }

  async findAll(authUser: AuthUserPayload, status?: string) {
    const filter: Record<string, unknown> = {
      status: { $ne: SubjectStatus.DELETED },
    };
    if (status) {
      filter.status = status;
    }

    const subjects = await this.subjectRepository.findAll(filter);

    return subjects
      .filter((s) => {
        if (s.status !== SubjectStatus.HOLD) return true;
        if (authUser.type === UserType.ADMIN) return true;
        return s.createdBy?.toString() === authUser.userId;
      })
      .map((s) => this.toResponse(s));
  }

  async findOne(authUser: AuthUserPayload, id: string) {
    const subject = await this.subjectRepository.findById(id);
    if (!subject || subject.status === SubjectStatus.DELETED) {
      throw new NotFoundException('Subject not found');
    }
    if (
      subject.status === SubjectStatus.HOLD &&
      authUser.type !== UserType.ADMIN &&
      subject.createdBy?.toString() !== authUser.userId
    ) {
      throw new ForbiddenException('Subject is on hold');
    }
    return this.toResponse(subject);
  }

  async update(authUser: AuthUserPayload, id: string, dto: UpdateSubjectDto) {
    if (authUser.type !== UserType.ADMIN) {
      throw new ForbiddenException('Only admin can update subjects');
    }

    const subject = await this.subjectRepository.findById(id);
    if (!subject || subject.status === SubjectStatus.DELETED) {
      throw new NotFoundException('Subject not found');
    }

    if (dto.subjectName) {
      const duplicate = await this.subjectRepository.findByNameNormalized(dto.subjectName);
      if (
        duplicate &&
        duplicate._id.toString() !== id &&
        duplicate.status !== SubjectStatus.DELETED
      ) {
        throw new ConflictException(
          `Subject "${dto.subjectName.trim()}" already exists`,
        );
      }
    }

    const updated = await this.subjectRepository.updateById(id, dto);
    return this.toResponse(updated!);
  }

  async remove(authUser: AuthUserPayload, id: string) {
    if (authUser.type !== UserType.ADMIN) {
      throw new ForbiddenException('Only admin can delete subjects');
    }
    const subject = await this.subjectRepository.findById(id);
    if (!subject || subject.status === SubjectStatus.DELETED) {
      throw new NotFoundException('Subject not found');
    }
    await this.subjectRepository.updateById(id, { status: SubjectStatus.DELETED });
    return { message: 'Subject deleted successfully' };
  }

  private toResponse(subject: SubjectCatalogDocument) {
    return {
      subjectId: subject._id.toString(),
      subjectName: this.displayName(subject.subjectName),
      status: subject.status,
      createdBy: subject.createdBy?.toString(),
      createdByName: subject.createdByName,
      createdByType: subject.createdByType,
      createdAt: (subject as { createdAt?: Date }).createdAt,
      updatedAt: (subject as { updatedAt?: Date }).updatedAt,
    };
  }

  private displayName(name: string) {
    return name
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }
}
