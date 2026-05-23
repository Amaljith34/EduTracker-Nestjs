import { SubjectStatus } from 'src/database/schema/subject-catalog.schema';
export declare class CreateSubjectDto {
    subjectName: string;
    status?: SubjectStatus;
}
