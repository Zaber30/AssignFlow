import api from "./api";

import type { AssignTeacherSubjectRequest } from "../types/AssignTeacherSubjectRequest";
import type { TeacherSubjectResponse } from "../types/TeacherSubjectResponse";

export const getTeacherSubjects = async () => {

    const response =
        await api.get<TeacherSubjectResponse[]>(
            "/TeacherSubject"
        );

    return response.data;
};


export const assignTeacherSubject = async (
    request: AssignTeacherSubjectRequest
) => {

    const response =
        await api.post<TeacherSubjectResponse>(
            "/TeacherSubject",
            request
        );

    return response.data;
};


export const deleteTeacherSubject = async (
    id: string
) => {

    const response =
        await api.delete(
            `/TeacherSubject/${id}`
        );

    return response.data;
};