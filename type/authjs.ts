export type AuthState = {
    success?: boolean;
    message?: string;
    email?: string;
    password?: string;
    error?: {
        name?: string[];
        email?: string[];
        password?: string[];
    };
};