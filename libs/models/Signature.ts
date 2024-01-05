export interface Signature {
    id?: string;
    name: string;
    acceptance: boolean;
    signatureDate: Date;
    signatureDateTimeZone?: string;
    ipAddress: string;
}