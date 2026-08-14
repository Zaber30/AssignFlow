import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getAssignmentSubmissions
} from "../../../api/submissionApi";

import type {
    SubmissionResponse
} from "../../../types/SubmissionResponse";


export default function SubmissionList() {

    const { assignmentId } = useParams<{
        assignmentId: string;
    }>();

    const navigate = useNavigate();

    const [submissions, setSubmissions] =
        useState<SubmissionResponse[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        const loadSubmissions = async () => {

            if (!assignmentId) {
                setError("Assignment ID is missing.");
                setLoading(false);
                return;
            }

            try {

                setLoading(true);
                setError("");

                const data =
                    await getAssignmentSubmissions(
                        assignmentId
                    );

                console.log(
                    "Assignment submissions:",
                    data
                );

                setSubmissions(data);

            }
            catch (err: any) {

                console.error(
                    "Failed to load submissions:",
                    err
                );

                setError(
                    err.response?.data?.message ??
                    "Failed to load submissions."
                );

            }
            finally {

                setLoading(false);

            }
        };

        loadSubmissions();

    }, [assignmentId]);


    if (loading) {

        return (
            <div className="p-6">

                <h1 className="text-3xl font-bold">
                    Submissions
                </h1>

                <p className="mt-4 text-gray-500">
                    Loading submissions...
                </p>

            </div>
        );
    }


    return (

        <div className="p-6">

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold">
                        Assignment Submissions
                    </h1>

                    <p className="text-gray-500 mt-1">
                        View and review student submissions.
                    </p>

                </div>

                <button
                    onClick={() =>
                        navigate(
                            "/teacher/assignments"
                        )
                    }
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Back to Assignments
                </button>

            </div>


            {/* Error */}

            {error && (

                <div className="mb-5 p-4 bg-red-100 border border-red-300 text-red-700 rounded">

                    {error}

                </div>

            )}


            {/* Empty */}

            {!error &&
                submissions.length === 0 && (

                    <div className="bg-white rounded-lg shadow p-8 text-center">

                        <h2 className="text-xl font-semibold">
                            No submissions yet
                        </h2>

                        <p className="text-gray-500 mt-2">
                            No students have submitted this assignment.
                        </p>

                    </div>
                )}


            {/* Table */}

            {submissions.length > 0 && (

                <div className="bg-white rounded-lg shadow overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                        <tr>

                            <th className="text-left p-4">
                                Student
                            </th>

                            <th className="text-left p-4">
                                Submitted At
                            </th>

                            <th className="text-left p-4">
                                Marks
                            </th>

                            <th className="text-left p-4">
                                Status
                            </th>

                            <th className="text-left p-4">
                                Action
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {submissions.map(
                            (submission) => (

                                <tr
                                    key={submission.id}
                                    className="border-t hover:bg-gray-50"
                                >

                                    <td className="p-4 font-medium">
                                        {submission.studentName}
                                    </td>


                                    <td className="p-4">
                                        {new Date(
                                            submission.submittedAt
                                        ).toLocaleString()}
                                    </td>


                                    <td className="p-4">

                                        {submission.marks === null
                                            ? "-"
                                            : submission.marks}

                                    </td>


                                    <td className="p-4">

                                            <span
                                                className={
                                                    submission.marks !== null
                                                        ? "px-3 py-1 rounded-full text-sm bg-green-100 text-green-700"
                                                        : "px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700"
                                                }
                                            >

                                                {submission.marks !== null
                                                    ? "Graded"
                                                    : "Submitted"}

                                            </span>

                                    </td>


                                    <td className="p-4">

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/teacher/submissions/${submission.id}/review`
                                                )
                                            }
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                        >
                                            {submission.marks !== null
                                                ? "Review Again"
                                                : "Review"}
                                        </button>

                                    </td>

                                </tr>

                            )
                        )}

                        </tbody>

                    </table>

                </div>

            )}

        </div>
    );
}