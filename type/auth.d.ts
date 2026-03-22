import {type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user: User & DefaultSession["user"];
    }

    interface User {
        role?: string;
    }
}

declare module "next-auth/jwt"{
    interface JWT {
        sub:string;
        role?: string;
    } 
}

export type AuthState = {
    success?: boolean;
    message?: string;
    error?: {
        name?: string[];
        email?: string[];
        password?: string[];
    };
}
