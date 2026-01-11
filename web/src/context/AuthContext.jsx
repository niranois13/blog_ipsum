import { createContext, useContext } from "react";
import useMe from "../hooks/auth/useMe";

const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const { data: user, isLoading, isError } = useMe();

    const isLoggedIn = !!user;

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoggedIn,
                loading: isLoading,
                isError,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
}
