export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
        subjects?: { id: string; name: string; age: number }[];
        permissions?: string[];
        notifications?: {
            pending_analysis: number | null;
        };
        is_impersonating?: boolean;
        impersonator?: User | null;
    };
    flash?: {
        success?: string | null;
        error?: string | null;
    };
};
