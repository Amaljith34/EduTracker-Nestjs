import { FilterQuery, Model } from 'mongoose';
import { SubjectCatalog, SubjectCatalogDocument } from '../schema/subject-catalog.schema';
export declare class SubjectCatalogRepository {
    private readonly subjectModel;
    constructor(subjectModel: Model<SubjectCatalogDocument>);
    findByNameNormalized(subjectName: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, SubjectCatalogDocument, {}, {}> & SubjectCatalog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, import("mongoose").Document<unknown, {}, SubjectCatalogDocument, {}, {}> & SubjectCatalog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, SubjectCatalogDocument, "findOne", {}>;
    create(data: Partial<SubjectCatalog>): Promise<import("mongoose").Document<unknown, {}, SubjectCatalogDocument, {}, {}> & SubjectCatalog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    findAll(filter?: FilterQuery<SubjectCatalogDocument>): import("mongoose").Query<(import("mongoose").Document<unknown, {}, SubjectCatalogDocument, {}, {}> & SubjectCatalog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[], import("mongoose").Document<unknown, {}, SubjectCatalogDocument, {}, {}> & SubjectCatalog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, SubjectCatalogDocument, "find", {}>;
    findById(id: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, SubjectCatalogDocument, {}, {}> & SubjectCatalog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, import("mongoose").Document<unknown, {}, SubjectCatalogDocument, {}, {}> & SubjectCatalog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, SubjectCatalogDocument, "findOne", {}>;
    updateById(id: string, data: Partial<SubjectCatalog>): import("mongoose").Query<import("mongoose").Document<unknown, {}, SubjectCatalogDocument, {}, {}> & SubjectCatalog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, import("mongoose").Document<unknown, {}, SubjectCatalogDocument, {}, {}> & SubjectCatalog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, SubjectCatalogDocument, "findOneAndUpdate", {}>;
    deleteById(id: string): import("mongoose").Query<import("mongoose").Document<unknown, {}, SubjectCatalogDocument, {}, {}> & SubjectCatalog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, import("mongoose").Document<unknown, {}, SubjectCatalogDocument, {}, {}> & SubjectCatalog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, SubjectCatalogDocument, "findOneAndDelete", {}>;
    countActive(): import("mongoose").Query<number, import("mongoose").Document<unknown, {}, SubjectCatalogDocument, {}, {}> & SubjectCatalog & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }, {}, SubjectCatalogDocument, "countDocuments", {}>;
}
