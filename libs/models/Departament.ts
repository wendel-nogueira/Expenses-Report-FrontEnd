export interface Departament {
    id?: string;
    name: string;
    acronym: string;
    description: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
    managers?: string[];
    users?: string[];
}