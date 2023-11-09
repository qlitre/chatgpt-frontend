export type User = {
    id?: number;
    last_name?: string;
    first_name?: string;
    email?: string;
    auth_token?: string;
}

export type CheckAuthResponse = {
    isAuthenticated: boolean;
}

// GET user/me
export type UserMeResponse = {
    first_name: string;
    last_name: string;
    id: number;
    email: string;
}

export type LoginResponse = {
    auth_token: string;
}

export type LoginError = {
    non_field_errors: string[];
}

export type UserCreateResponse = {
    first_name: string,
    last_name: string,
    email: string,
    id: number
}

export type UserCreateError = {
    email?: string[];
    password?: string[];
    first_name?: string[];
    last_name?: string[];
    non_field_errors?: string[];
}

export type UserUpdateResponse = {
    first_name?: string[];
    last_name?: string[];
}



