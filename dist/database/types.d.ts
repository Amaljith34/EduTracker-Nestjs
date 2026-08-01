export declare enum DBStatus {
    ACTIVE = "ACTIVE",
    HOLD = "HOLD",
    DELETED = "DELETED"
}
export interface IPagination {
    limit?: number;
    page?: number;
}
