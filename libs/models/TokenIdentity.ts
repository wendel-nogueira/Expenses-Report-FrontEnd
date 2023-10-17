export interface TokenIdentity {
    aud: string;
    email: string;
    exp: number;
    iat: number;
    iss: string;
    nameid: string;
    nbf: number;
    permissions: string;
    role: string;
}