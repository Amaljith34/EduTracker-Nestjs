import { IPagination } from 'src/database/types';
export declare class HelperFunctionUtils {
    static hashPassword(password: string): Promise<string>;
    static comparePassword(password: string, hash: string): Promise<boolean>;
    static getPaginationParams(data: IPagination): {
        limit: number;
        skip: number;
    };
}
