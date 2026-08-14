import type { AssignmentStatus } from "./AssignmentStatus";

export interface AssignmentDetails {

    id: string;

    teacherId: string;
    teacherName: string;

    classId: string;
    className: string;

    subjectId: string;
    subjectName: string;

    title: string;
    description: string;

    deadline: string;

    maxMarks: number;

    status: AssignmentStatus;

    createdAt: string;
    updatedAt?: string;
}