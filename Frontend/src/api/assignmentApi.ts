import api from "./api";

import type {
    AssignmentDetails
} from "../types/AssignmentDetails";

import type {
    CreateAssignmentRequest
} from "../types/CreateAssignmentRequest";


export const getAssignments = async () => {

    const response =
        await api.get<AssignmentDetails[]>(
            "/Assignments"
        );

    return response.data;
};


export const getMyTeaching = async () => {

    const response =
        await api.get("/Assignments/my-teaching");

    return response.data;
};


export const createAssignment = async (
    request: CreateAssignmentRequest
) => {

    const response =
        await api.post(
            "/Assignments",
            request
        );

    return response.data;
};

// ==========================================
// Publish assignment
// ==========================================

export const publishAssignment = async (
    id: string
) => {

    const response =
        await api.put(
            `/Assignments/${id}/publish`
);

return response.data;
};