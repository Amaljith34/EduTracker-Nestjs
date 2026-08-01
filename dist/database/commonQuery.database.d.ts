import { FilterQuery, Model, PopulateOptions, QueryOptions, Types } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { JwTPayloadType } from 'src/api/auth/auth.type';
export interface IDatabaseUtils {
    id?: string;
    model: Model<any, any, {}, {}, any>;
    modelName?: string;
    populate?: string | PopulateOptions | (string | PopulateOptions)[];
    filters?: FilterQuery<any>;
    options?: QueryOptions;
    limit?: number;
}
export declare class CommonQueryDatabase {
    static authUser(jwTPayload: JwTPayloadType, userModel: Model<UserDocument>): Promise<import("mongoose").Document<unknown, {}, UserDocument, {}, {}> & User & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    static getCountWithFilters({ model, filters }: IDatabaseUtils): Promise<any>;
    static findAllWithFilters({ model, modelName, populate, filters, options, }: IDatabaseUtils): Promise<any[]>;
    static findById({ id, model, modelName, populate }: IDatabaseUtils): Promise<any>;
    static isObjectId(id: string): boolean;
    static getObjectId(id: string): Types.ObjectId;
}
