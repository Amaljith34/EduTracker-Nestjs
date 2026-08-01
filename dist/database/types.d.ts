export declare enum DBStatus {
    ACTIVE = "ACTIVE",
    HOLD = "HOLD",
    DELETED = "DELETED"
}
export declare enum RecordStatus {
    PENDING = "Pending",
    APPROVED = "Approved",
    DELETED = "Deleted"
}
export interface IPagination {
    limit?: number;
    page?: number;
}
