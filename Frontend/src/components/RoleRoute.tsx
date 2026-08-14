import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type {JSX} from "react";

interface Props {

    children: JSX.Element;

    role: string;
}

export default function RoleRoute({
                                      children,
                                      role
                                  }: Props) {

    const { user } = useAuth();

    if (!user)
        return <Navigate to="/" replace />;

    if (user.role !== role)
        return <Navigate to="/" replace />;

    return children;
}