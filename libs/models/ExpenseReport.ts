import { Expense } from "./Expense";
import { Signature } from "./Signature";

export interface ExpenseReport {
    id?: string;
    userId: string;
    departamentId: string;
    projectId: string;
    status: number;
    totalAmount: number;
    amountApproved: number;
    amountRejected: number;
    amountPaid: number;
    paidById: string;
    paidDate: Date;
    statusNotes: string;
    proofOfPayment: string;
    expenses: Expense[];
    signatures: Signature[];
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}