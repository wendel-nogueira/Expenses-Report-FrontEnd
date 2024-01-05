export interface Expense {
    id?: string;
    expenseAccount: string;
    amount: number;
    dateIncurred: Date;
    dateIncurredTimeZone?: string;
    explanation: string;
    status?: number;
    actionBy?: string;
    actionDate?: Date;
    actionDateTimeZone?: string;
    accountingNotes?: string;
    receipt?: string;
    createdAt?: Date;
    updatedAt?: Date;
}