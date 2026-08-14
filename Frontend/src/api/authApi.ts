import api from "./api";
import type {LoginRequest} from "../types/LoginRequest.tsx";
import type {LoginResponse} from "../types/LoginResponse";

export const login = async (request: LoginRequest) => {

    const response = await api.post<LoginResponse>(
        "/Auth/login",
        request
    );

    return response.data;
};