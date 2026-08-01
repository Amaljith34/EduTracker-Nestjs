export enum DBStatus {
  ACTIVE = 'ACTIVE',
  HOLD = 'HOLD',
  DELETED = 'DELETED',
}

/** Status for Review and Transaction records */
export enum RecordStatus {
  PENDING = 'Pending',
  APPROVED = 'Approved',
  DELETED = 'Deleted',
}

export interface IPagination {
  limit?: number;
  page?: number;
}
