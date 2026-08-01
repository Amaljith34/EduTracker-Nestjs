import { Document, Types } from 'mongoose';
export declare enum SubjectStatus {
    ACTIVE = "active",
    HOLD = "hold",
    INACTIVE = "inactive",
    DELETED = "deleted"
}
export type SubjectCatalogDocument = SubjectCatalog & Document;
export declare class SubjectCatalog {
    subjectName: string;
    status: SubjectStatus;
    createdBy?: Types.ObjectId;
    createdByName?: string;
    createdByType?: string;
}
export declare const SubjectCatalogSchema: import("mongoose").Schema<SubjectCatalog, import("mongoose").Model<SubjectCatalog, any, any, any, Document<unknown, any, SubjectCatalog, any, {}> & SubjectCatalog & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SubjectCatalog, Document<unknown, {}, import("mongoose").FlatRecord<SubjectCatalog>, {}, import("mongoose").DefaultSchemaOptions> & import("mongoose").FlatRecord<SubjectCatalog> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
