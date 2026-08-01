import { RecordStatus } from 'src/database/types';
export declare class UpdateTransactionDto {
    amountPaid?: number;
    paymentDate?: string;
    notes?: string;
    status?: RecordStatus;
}
