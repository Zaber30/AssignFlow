import {type ReactNode, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import type {AuthUser} from "../types/AuthUser.ts";

interface Props {

    children: ReactNode;
}

export default function AuthProvider({ children }: Props) {

    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {

        const token = localStorage.getItem("token");

        const userString = localStorage.getItem("user");

        if (token && userString) {

            const savedUser = JSON.parse(userString);

            setUser({
                ...savedUser,
                token
            });
        }

    }, []);

    const login = (response: any) => {

        localStorage.setItem("token", response.token);

        localStorage.setItem(
            "user",
            JSON.stringify(response.user)
        );

        setUser({

            ...response.user,

            token: response.token
        });
    };

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);
    };

    return (

        <AuthContext.Provider
            value={{
                user,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}