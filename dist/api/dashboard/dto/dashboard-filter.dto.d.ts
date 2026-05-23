import { DateFilterQuery } from 'src/helpers/date-filter.helper';
export declare class DashboardFilterDto implements DateFilterQuery {
    userId?: string;
    fromDate?: string;
    toDate?: string;
    period?: 'week' | 'month' | 'year';
}
