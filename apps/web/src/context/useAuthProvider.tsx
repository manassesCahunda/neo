"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Authorized } from "@/hooks/use-authorization";
import { useRouter } from "next/navigation";

type AuthContextType = {
    isAuthorized: boolean;
    loading: boolean;
    error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuthorization = async () => {
            setLoading(true);
            try {
                const result = await Authorized();

                console.log("result");
                console.log(result);

                if (result.success) {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                    router.push("/auth");
                }
            } catch (e) {
                setError("Erro de autenticação.");
            } finally {
                setLoading(false);
            }
        };

        checkAuthorization();
    }, [router]);

    return (
        <AuthContext.Provider value={{ isAuthorized, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    
    if (context === undefined) {
        throw new Error("useAuth deve ser usado dentro do AuthProvider");
    }
    return context;
};
