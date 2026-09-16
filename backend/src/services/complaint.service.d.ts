export declare const createComplaint: (citizenId: string, data: any) => Promise<{
    id: string;
    createdAt: Date;
    ticketNumber: string;
    title: string | null;
    description: string | null;
    latitude: number;
    longitude: number;
    address: string | null;
    damageType: string | null;
    severity: number | null;
    status: string;
    assignedOfficerId: string | null;
    slaHours: number | null;
    slaDeadline: Date | null;
    updatedAt: Date;
    citizenId: string;
    authorityId: string | null;
}>;
export declare const getComplaintsByCitizen: (citizenId: string) => Promise<({
    authority: {
        id: string;
        name: string;
        createdAt: Date;
        latitude: number | null;
        longitude: number | null;
        type: string | null;
        level: number | null;
        parentAuthorityId: string | null;
        district: string | null;
        state: string | null;
    } | null;
} & {
    id: string;
    createdAt: Date;
    ticketNumber: string;
    title: string | null;
    description: string | null;
    latitude: number;
    longitude: number;
    address: string | null;
    damageType: string | null;
    severity: number | null;
    status: string;
    assignedOfficerId: string | null;
    slaHours: number | null;
    slaDeadline: Date | null;
    updatedAt: Date;
    citizenId: string;
    authorityId: string | null;
})[]>;
//# sourceMappingURL=complaint.service.d.ts.map