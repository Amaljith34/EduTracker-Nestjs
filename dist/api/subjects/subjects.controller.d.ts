import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    create(dto: CreateSubjectDto): Promise<{
        subjectId: string;
        subjectName: string;
        status: import("../../database/schema/subject-catalog.schema").SubjectStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(status?: string): Promise<{
        subjectId: string;
        subjectName: string;
        status: import("../../database/schema/subject-catalog.schema").SubjectStatus;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        subjectId: string;
        subjectName: string;
        status: import("../../database/schema/subject-catalog.schema").SubjectStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, dto: UpdateSubjectDto): Promise<{
        subjectId: string;
        subjectName: string;
        status: import("../../database/schema/subject-catalog.schema").SubjectStatus;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
