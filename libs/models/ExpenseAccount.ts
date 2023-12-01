export interface ExpenseAccount {
    id?: string;
    name: string;
    code: string;
    description: string;
    type: number;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}