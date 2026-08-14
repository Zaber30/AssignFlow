import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type {JSX} from "react";

interface Props {
    children: JSX.Element;
}

export default function ProtectedRoute({ children }: Props) {

    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}