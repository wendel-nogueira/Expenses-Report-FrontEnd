export interface Expense {
    id?: string;
    amount: number;
    dateIncurred: Date;
    explanation: string;
    status?: number;
    actionById?: string;
    actionDate?: Date;
    accountingNotes?: string;
    receipt?: string;
    createdAt?: Date;
    updatedAt?: Date;
}