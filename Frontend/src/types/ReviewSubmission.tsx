export interface ReviewSubmission {
    id: string;

    assignmentId: string;

    assignmentTitle: string;

    studentId: string;

    studentName: string;

    answer: string;

    attachmentUrl?: string | null;

    submittedAt: string;

    marks: number | null;

    feedback?: string | null;

    status: number;

    createdAt: string;

    updatedAt?: string | null;
}

