import { FilterQuery, Model, PopulateOptions, QueryOptions } from 'mongoose';
import { IPagination } from 'src/database/types';
export interface IFetchById {
    id: string;
    model: Model<any>;
    populate?: string | PopulateOptions | (string | PopulateOptions)[];
    filters?: FilterQuery<any>;
    modelName?: string;
}
export interface IFetchAll {
    model: Model<any>;
    filters?: FilterQuery<any>;
    options?: QueryOptions;
    pagination?: IPagination;
    sort?: Record<string, 1 | -1>;
}
export declare class DbHelpers {
    static assertObjectId(id: string, label?: string): void;
    static findById({ id, model, populate, filters, modelName, }: IFetchById): Promise<any>;
    static findAll({ model, filters, options, pagination, sort, }: IFetchAll): Promise<any[]>;
    static monthDateRange(month: number, year: number): {
        from: string;
        to: string;
    };
}
