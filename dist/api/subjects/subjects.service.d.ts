import { SubjectCatalogRepository } from 'src/database/repositories/subject-catalog.repository';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectsService {
    private readonly subjectRepository;
    constructor(subjectRepository: SubjectCatalogRepository);
    create(dto: CreateSubjectDto): Promise<{
        subjectId: string;
        subjectName: string;
        status: import("src/database/schema/subject-catalog.schema").SubjectStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(status?: string): Promise<{
        subjectId: string;
        subjectName: string;
        status: import("src/database/schema/subject-catalog.schema").SubjectStatus;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        subjectId: string;
        subjectName: string;
        status: import("src/database/schema/subject-catalog.schema").SubjectStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateSubjectDto): Promise<{
        subjectId: string;
        subjectName: string;
        status: import("src/database/schema/subject-catalog.schema").SubjectStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
    private toResponse;
    private displayName;
}
