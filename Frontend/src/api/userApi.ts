import api from "./api";

import type { UserResponse } from "../types/UserResponse";
import type { CreateUserRequest } from "../types/CreateUserRequest";
import type { UpdateUserRequest } from "../types/UpdateUserRequest";


export const getUsers = async () => {

    const response =
        await api.get<UserResponse[]>("/Users");

    return response.data;
};


export const createUser = async (
    request: CreateUserRequest
) => {

    const response =
        await api.post("/Users", request);

    return response.data;
};


export const deleteUser = async (id: string) => {

    const response =
        await api.delete(`/Users/${id}`);

    return response.data;
};


export const getUserById = async (id: string) => {

    const response =
        await api.get<UserResponse>(`/Users/${id}`);

    return response.data;
};


export const updateUser = async (
    id: string,
    request: UpdateUserRequest
) => {

    const response =
        await api.put(
            `/Users/${id}`,
            request
        );

    return response.data;
};
