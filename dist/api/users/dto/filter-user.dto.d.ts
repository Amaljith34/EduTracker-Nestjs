import { PaginationQuery } from 'src/helpers/pagination.helper';
export declare class FilterUserDto implements PaginationQuery {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    subscriberId?: string;
}
