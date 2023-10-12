export interface User {
    id: string;
    identityId: string;
    name: Name;
    address: Address;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Name {
    firstName: string;
    lastName: string;
}

export interface Address {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
}
