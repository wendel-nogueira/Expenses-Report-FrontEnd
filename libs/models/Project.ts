export interface Project {
    id?: string;
    name: string;
    code: string;
    description: string;
    departamentId: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}