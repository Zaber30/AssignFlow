export interface SubmissionResponse {

    id: string;

    assignmentId: string;

    assignmentTitle: string;

    studentId: string;

    studentName: string;

    submittedAt: string;

    marks: number | null;

    status: number;
}