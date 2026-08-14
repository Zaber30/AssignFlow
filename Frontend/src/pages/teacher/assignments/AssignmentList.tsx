import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAssignments,
    publishAssignment
} from "../../../api/assignmentApi";

import type { AssignmentDetails }
    from "../../../types/AssignmentDetails";


export default function AssignmentList() {

    const navigate = useNavigate();

    const [assignments, setAssignments] =
        useState<AssignmentDetails[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [publishingId, setPublishingId] =
        useState<string | null>(null);


    // ==========================================
    // Load assignments
    // ==========================================

    const loadAssignments = async () => {

        try {

            setLoading(true);
            setError("");

            const data =
                await getAssignments();

            console.log(
                "Teacher assignments:",
                data
            );

            setAssignments(data);

        }
        catch (err: any) {

            console.error(
                "Failed to load assignments:",
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


    // ==========================================
    // Initial load
    // ==========================================

    useEffect(() => {

        loadAssignments();

    }, []);


    // ==========================================
    // Publish Assignment
    // ==========================================

    const handlePublish = async (
        id: string
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to publish this assignment?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setError("");

            setPublishingId(id);

            await publishAssignment(id);

            alert(
                "Assignment published successfully."
            );

            await loadAssignments();

        }
        catch (err: any) {

            console.error(
                "Publish assignment error:",
                err
            );

            setError(
                err.response?.data?.message ??
                "Failed to publish assignment."
            );

        }
        finally {

            setPublishingId(null);

        }

    };


    // ==========================================
    // View Submissions
    // ==========================================

    const handleViewSubmissions = (
        assignmentId: string
    ) => {

        navigate(
            `/teacher/assignments/${assignmentId}/submissions`
        );

    };


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <div className="p-6">

                <h1 className="text-3xl font-bold">
                    My Assignments
                </h1>

                <p className="mt-4 text-gray-500">
                    Loading assignments...
                </p>

            </div>

        );

    }


    return (

        <div className="p-6">

            {/* ================================= */}
            {/* Header */}
            {/* ================================= */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold">
                        My Assignments
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Manage assignments created by you.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/teacher/assignments/create"
                        )
                    }
                    className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >

                    Create Assignment

                </button>

            </div>


            {/* ================================= */}
            {/* Error */}
            {/* ================================= */}

            {error && (

                <div className="mb-5 p-4 bg-red-100 border border-red-300 text-red-700 rounded">

                    {error}

                </div>

            )}


            {/* ================================= */}
            {/* Empty */}
            {/* ================================= */}

            {!error &&
                assignments.length === 0 && (

                    <div className="bg-white rounded-lg shadow p-8 text-center">

                        <h2 className="text-xl font-semibold">
                            No assignments found
                        </h2>

                        <p className="text-gray-500 mt-2">
                            You have not created any assignments yet.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/teacher/assignments/create"
                                )
                            }
                            className="mt-5 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >

                            Create Your First Assignment

                        </button>

                    </div>

                )}


            {/* ================================= */}
            {/* Assignment Table */}
            {/* ================================= */}

            {assignments.length > 0 && (

                <div className="bg-white rounded-lg shadow overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                        <tr>

                            <th className="text-left p-4">
                                Title
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
                                Status
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

                                    {/* Title */}

                                    <td className="p-4 font-medium">

                                        {assignment.title}

                                    </td>


                                    {/* Class */}

                                    <td className="p-4">

                                        {assignment.className}

                                    </td>


                                    {/* Subject */}

                                    <td className="p-4">

                                        {assignment.subjectName}

                                    </td>


                                    {/* Deadline */}

                                    <td className="p-4">

                                        {new Date(
                                            assignment.deadline
                                        ).toLocaleString()}

                                    </td>


                                    {/* Max Marks */}

                                    <td className="p-4">

                                        {assignment.maxMarks}

                                    </td>


                                    {/* Status */}

                                    <td className="p-4">

                                        {assignment.status === 2 ? (

                                            <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-700">

                                                    Published

                                                </span>

                                        ) : (

                                            <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-700">

                                                    Draft

                                                </span>

                                        )}

                                    </td>


                                    {/* ================================= */}
                                    {/* Actions */}
                                    {/* ================================= */}

                                    <td className="p-4">

                                        <div className="flex gap-2 flex-wrap">

                                            {/* Publish */}

                                            {assignment.status === 1 && (

                                                <button
                                                    type="button"
                                                    disabled={
                                                        publishingId ===
                                                        assignment.id
                                                    }
                                                    onClick={() =>
                                                        handlePublish(
                                                            assignment.id
                                                        )
                                                    }
                                                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                                                >

                                                    {publishingId ===
                                                    assignment.id
                                                        ? "Publishing..."
                                                        : "Publish"}

                                                </button>

                                            )}


                                            {/* View Submissions */}

                                            {assignment.status === 2 && (

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleViewSubmissions(
                                                            assignment.id
                                                        )
                                                    }
                                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                >

                                                    View Submissions

                                                </button>

                                            )}

                                        </div>

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