export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    total?: number;
}
export declare class ApiResponseUtil {
    static success<T>(data: T, message?: string): ApiResponse<T>;
    static successMessage(message: string): ApiResponse;
    static list<T>(data: T[], message?: string): ApiResponse<T[]>;
}
