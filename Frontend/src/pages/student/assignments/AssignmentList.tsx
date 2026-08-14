
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getStudentAssignments
} from "../../../api/studentAssignmentApi";

import type {
    AssignmentDetails
} from "../../../types/AssignmentDetails";


export default function StudentAssignmentList() {

    const navigate = useNavigate();

    const [assignments, setAssignments] =
        useState<AssignmentDetails[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =====================================================
    // Load published assignments
    // =====================================================

    useEffect(() => {

        const loadAssignments = async () => {

            try {

                setLoading(true);
                setError("");

                const data =
                    await getStudentAssignments();

                console.log(
                    "Published assignments:",
                    data
                );

                setAssignments(data);

            }
            catch (err: any) {

                console.error(
                    "Failed to load student assignments:",
                    err
                );

                setError(
                    err.response?.data?.message ??
                    "Failed to load assignments."
                );

            }
            finally {

                setLoading(false);

            }

        };


        loadAssignments();

    }, []);


    // =====================================================
    // Loading
    // =====================================================

    if (loading) {

        return (

            <div className="p-6">

                <h1 className="text-3xl font-bold">
                    Assignments
                </h1>

                <p className="mt-4 text-gray-500">
                    Loading assignments...
                </p>

            </div>

        );

    }


    // =====================================================
    // Page
    // =====================================================

    return (

        <div className="p-6">

            {/* Header */}

            <div className="mb-6">

                <h1 className="text-3xl font-bold">
                    Assignments
                </h1>

                <p className="text-gray-500 mt-1">
                    View all published assignments.
                </p>

            </div>


            {/* Error */}

            {error && (

                <div className="mb-5 p-4 bg-red-100 border border-red-300 text-red-700 rounded">

                    {error}

                </div>

            )}


            {/* Empty */}

            {!error &&
                assignments.length === 0 && (

                    <div className="bg-white rounded-lg shadow p-8 text-center">

                        <h2 className="text-xl font-semibold">
                            No assignments available
                        </h2>

                        <p className="text-gray-500 mt-2">
                            There are no published assignments yet.
                        </p>

                    </div>

                )}


            {/* Assignment table */}

            {assignments.length > 0 && (

                <div className="bg-white rounded-lg shadow overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="text-left p-4">
                                    Title
                                </th>

                                <th className="text-left p-4">
                                    Teacher
                                </th>

                                <th className="text-left p-4">
                                    Class
                                </th>

                                <th className="text-left p-4">
                                    Subject
                                </th>

                                <th className="text-left p-4">
                                    Deadline
                                </th>

                                <th className="text-left p-4">
                                    Max Marks
                                </th>

                                <th className="text-left p-4">
                                    Action
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {assignments.map(
                                (assignment) => (

                                    <tr
                                        key={assignment.id}
                                        className="border-t hover:bg-gray-50"
                                    >

                                        <td className="p-4 font-medium">

                                            {assignment.title}

                                        </td>


                                        <td className="p-4">

                                            {assignment.teacherName}

                                        </td>


                                        <td className="p-4">

                                            {assignment.className}

                                        </td>


                                        <td className="p-4">

                                            {assignment.subjectName}

                                        </td>


                                        <td className="p-4">

                                            {new Date(
                                                assignment.deadline
                                            ).toLocaleString()}

                                        </td>


                                        <td className="p-4">

                                            {assignment.maxMarks}

                                        </td>


                                        <td className="p-4">

                                            <button
                                                onClick={() =>
                                                    navigate(
                                                        `/student/assignments/${assignment.id}`
                                                    )
                                                }
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                            >
                                                View
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
