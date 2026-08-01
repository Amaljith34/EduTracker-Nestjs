import { SubjectStatus } from 'src/database/schema/subject-catalog.schema';
import { SubjectCatalogRepository } from 'src/database/repositories/subject-catalog.repository';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { AuthUserPayload } from '../auth/auth.type';
export declare class SubjectsService {
    private readonly subjectRepository;
    constructor(subjectRepository: SubjectCatalogRepository);
    create(authUser: AuthUserPayload, dto: CreateSubjectDto): Promise<{
        subjectId: string;
        subjectName: string;
        status: SubjectStatus;
        createdBy: string;
        createdByName: string;
        createdByType: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(authUser: AuthUserPayload, status?: string): Promise<{
        subjectId: string;
        subjectName: string;
        status: SubjectStatus;
        createdBy: string;
        createdByName: string;
        createdByType: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(authUser: AuthUserPayload, id: string): Promise<{
        subjectId: string;
        subjectName: string;
        status: SubjectStatus;
        createdBy: string;
        createdByName: string;
        createdByType: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(authUser: AuthUserPayload, id: string, dto: UpdateSubjectDto): Promise<{
        subjectId: string;
        subjectName: string;
        status: SubjectStatus;
        createdBy: string;
        createdByName: string;
        createdByType: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(authUser: AuthUserPayload, id: string): Promise<{
        message: string;
    }>;
    private toResponse;
    private displayName;
}
