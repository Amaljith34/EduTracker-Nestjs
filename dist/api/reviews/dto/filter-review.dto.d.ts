import { DateFilterQuery } from 'src/helpers/date-filter.helper';
import { PaginationQuery } from 'src/helpers/pagination.helper';
export declare class FilterReviewDto implements PaginationQuery, DateFilterQuery {
    page?: string;
    limit?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    userId?: string;
    fromDate?: string;
    toDate?: string;
    period?: 'week' | 'month' | 'year';
}
