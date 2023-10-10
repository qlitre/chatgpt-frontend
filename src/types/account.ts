export type User = {
    id?: number;
    name?: string;
    email?: string;
    is_staff?: boolean;
}

export type CheckAuthResponse = {
    isAuthenticated: boolean;
}