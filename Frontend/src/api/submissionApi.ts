import api from "./api";

import type {
    SubmissionResponse
} from "../types/SubmissionResponse";

import type {
    SubmissionDetails
} from "../types/SubmissionDetails";

import type {
    ReviewSubmissionRequest
} from "../types/ReviewSubmissionRequest";


export interface CreateSubmissionRequest {
    assignmentId: string;

    answer: string;

    attachmentUrl?: string | null;
}


// =====================================================
// Student: Submit assignment
// =====================================================

export const submitAssignment = async (
    request: CreateSubmissionRequest
) => {
    const response = await api.post(
        "/Submissions",
        request
    );

    return response.data;
};


// =====================================================
// Student: Get my submissions
// =====================================================

export const getMySubmissions = async () => {
    const response =
        await api.get<SubmissionResponse[]>(
            "/Submissions/my"
        );

    return response.data;
};


// =====================================================
// Teacher: Get submissions for assignment
// =====================================================

export const getAssignmentSubmissions = async (
    assignmentId: string
) => {
    const response =
        await api.get<SubmissionResponse[]>(
            `/Submissions/assignment/${assignmentId}`
        );

    return response.data;
};


// =====================================================
// Teacher/Student: Get submission details
// =====================================================

export const getSubmissionById = async (
    id: string
) => {
    const response =
        await api.get<SubmissionDetails>(
            `/Submissions/${id}`
        );

    return response.data;
};


// =====================================================
// Teacher: Review submission
// =====================================================

export const reviewSubmission = async (
    id: string,
    request: ReviewSubmissionRequest
) => {
    const response =
        await api.put(
            `/Submissions/${id}/review`,
            request
        );

    return response.data;
};