export type PaginationQuery = {
    page?: string | number;
    limit?: string | number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    userId?: string;
    subscriberId?: string;
};
export declare const getPagination: (query: PaginationQuery) => {
    page: number;
    limit: number;
    skip: number;
    sort: {
        [x: string]: 1 | -1;
    };
};
export declare const paginated: <T>(data: T[], total: number, page: number, limit: number) => {
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};
