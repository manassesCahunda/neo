import jwt from "jsonwebtoken";
import { env } from "@neo/env";

interface UserData {
    email: string;
    name: string;
    userId: string;
    role: string;
}


export const isTokenExpired = (token: string): boolean => {
    const decoded = jwt.decode(token) as { exp?: number } | null;
    if (!decoded || !decoded.exp) return true;
    return decoded.exp * 1000 < Date.now();
};

export const validateToken = (token: string): boolean => {
    try {
        jwt.verify(token, env.SECRET_KEY_JWT || "default_secret_key");
        return !isTokenExpired(token);
    } catch (error) {
        console.error('Token validation error:', error);
        return false;
    }
};

export const parseToken = (token: string): UserData | null => jwt.decode(token) as UserData | null;

export const generateToken = ({ userId, name, email, role, expired }: UserData & { expired: string }) => 
    jwt.sign({email , name, userId, role }, env.SECRET_KEY_JWT || "default_secret_key", { expiresIn: expired });
