export declare enum DBStatus {
    ACTIVE = "Active",
    HOLD = "Hold",
    DELETED = "Deleted"
}
export interface IPagination {
    limit?: number;
    page?: number;
}
