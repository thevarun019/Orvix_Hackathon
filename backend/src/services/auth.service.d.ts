export declare const registerUser: (data: any) => Promise<{
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}>;
export declare const loginUser: (email: string, password: string) => Promise<{
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}>;
//# sourceMappingURL=auth.service.d.ts.map