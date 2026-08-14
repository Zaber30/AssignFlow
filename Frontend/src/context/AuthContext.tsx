import { createContext } from "react";
import type { LoginResponse } from "../types/LoginResponse";
import type { AuthUser } from "../types/AuthUser";

export interface AuthContextType {

    user: AuthUser | null;

    login: (response: LoginResponse) => void;

    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    login: () => {},
    logout: () => {}
});