import api from "./api";

import type { SubjectResponse } from "../types/SubjectResponse";
import type { CreateSubjectRequest } from "../types/CreateSubjectRequest";

export const getSubjects = async () => {

    const response = await api.get<SubjectResponse[]>("/Subjects");

    return response.data;
};

export const createSubject = async (
    request: CreateSubjectRequest
) => {

    const response = await api.post(
        "/Subjects",
        request
    );

    return response.data;
};