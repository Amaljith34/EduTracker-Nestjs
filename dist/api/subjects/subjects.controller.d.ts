import { AuthUserPayload } from '../auth/auth.type';
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
export declare class SubjectsController {
    private readonly subjectsService;
    constructor(subjectsService: SubjectsService);
    create(authUser: AuthUserPayload, dto: CreateSubjectDto): Promise<{
        subjectId: string;
        subjectName: string;
        status: import("../../database/schema/subject-catalog.schema").SubjectStatus;
        createdBy: string;
        createdByName: string;
        createdByType: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findAll(authUser: AuthUserPayload, status?: string): Promise<{
        subjectId: string;
        subjectName: string;
        status: import("../../database/schema/subject-catalog.schema").SubjectStatus;
        createdBy: string;
        createdByName: string;
        createdByType: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    findOne(authUser: AuthUserPayload, id: string): Promise<{
        subjectId: string;
        subjectName: string;
        status: import("../../database/schema/subject-catalog.schema").SubjectStatus;
        createdBy: string;
        createdByName: string;
        createdByType: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(authUser: AuthUserPayload, id: string, dto: UpdateSubjectDto): Promise<{
        subjectId: string;
        subjectName: string;
        status: import("../../database/schema/subject-catalog.schema").SubjectStatus;
        createdBy: string;
        createdByName: string;
        createdByType: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(authUser: AuthUserPayload, id: string): Promise<{
        message: string;
    }>;
}
