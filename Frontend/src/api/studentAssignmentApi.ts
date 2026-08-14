
import api from "./api";

import type { AssignmentDetails } from "../types/AssignmentDetails";


// =====================================================
// Get ALL published assignments
// =====================================================

export const getStudentAssignments = async () => {

    const response =
        await api.get<AssignmentDetails[]>(
            "/StudentAssignments"
        );

    return response.data;
};


// =====================================================
// Get one published assignment
// =====================================================

export const getStudentAssignmentById =
    async (id: string) => {

        const response =
            await api.get<AssignmentDetails>(
                `/StudentAssignments/${id}`
            );

        return response.data;
    };
