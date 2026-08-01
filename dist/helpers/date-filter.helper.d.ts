export type DateFilterQuery = {
    fromDate?: string;
    toDate?: string;
    period?: 'week' | 'month' | 'year';
};
export declare const parseLocalDate: (value: string, endOfDay?: boolean) => Date;
export declare const resolveDateRange: (query: DateFilterQuery) => {
    fromDate: Date;
    toDate: Date;
};
export declare const dateRangeMatch: (field: string, fromDate?: Date, toDate?: Date) => Record<string, unknown>;
