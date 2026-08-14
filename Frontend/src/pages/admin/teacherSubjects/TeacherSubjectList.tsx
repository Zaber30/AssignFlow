import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getTeacherSubjects,
    deleteTeacherSubject
} from "../../../api/teacherSubjectApi";

import type { TeacherSubjectResponse } from "../../../types/TeacherSubjectResponse";

export default function TeacherSubjectList() {

    const [assignments, setAssignments] =
        useState<TeacherSubjectResponse[]>([]);

    const [loading, setLoading] = useState(true);

    const loadAssignments = async () => {

        try {

            const data = await getTeacherSubjects();

            setAssignments(data);

        }
        catch (error) {

            console.error(
                "Failed to load teacher assignments:",
                error
            );

        }
        finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadAssignments();

    }, []);


    const handleDelete = async (id: string) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this assignment?"
            );

        if (!confirmed)
            return;

        try {

            await deleteTeacherSubject(id);

            setAssignments(
                previous =>
                    previous.filter(
                        item => item.id !== id
                    )
            );

            alert(
                "Teacher assignment deleted successfully."
            );

        }
        catch (error: any) {

            console.error(error);

            alert(
                error.response?.data?.message ??
                "Failed to delete assignment."
            );

        }
    };


    if (loading) {

        return (

            <div className="p-6">

                <h2 className="text-xl">
                    Loading teacher assignments...
                </h2>

            </div>

        );

    }


    return (

        <div className="p-6">

            <div className="flex justify-between items-center mb-6">

                <h1 className="text-3xl font-bold">

                    Teacher Assignments

                </h1>

                <Link

                    to="/admin/teacher-subjects/create"

                    className="bg-blue-600 text-white px-4 py-2 rounded"

                >

                    Assign Teacher

                </Link>

            </div>


            <div className="overflow-x-auto">

                <table className="w-full border">

                    <thead className="bg-gray-200">

                    <tr>

                        <th className="border p-3">
                            Teacher
                        </th>

                        <th className="border p-3">
                            Subject
                        </th>

                        <th className="border p-3">
                            Class
                        </th>

                        <th className="border p-3">
                            Created
                        </th>

                        <th className="border p-3">
                            Action
                        </th>

                    </tr>

                    </thead>


                    <tbody>

                    {assignments.map(
                        assignment => (

                            <tr
                                key={assignment.id}
                            >

                                <td className="border p-3">

                                    {assignment.teacherName}

                                </td>

                                <td className="border p-3">

                                    {assignment.subjectName}

                                </td>

                                <td className="border p-3">

                                    {assignment.className}

                                </td>

                                <td className="border p-3">

                                    {new Date(
                                        assignment.createdAt
                                    ).toLocaleDateString()}

                                </td>

                                <td className="border p-3">

                                    <button

                                        onClick={() =>
                                            handleDelete(
                                                assignment.id
                                            )
                                        }

                                        className="bg-red-600 text-white px-3 py-1 rounded"

                                    >

                                        Delete

                                    </button>

                                </td>

                            </tr>

                        )
                    )}

                    </tbody>

                </table>


                {assignments.length === 0 && (

                    <p className="text-gray-500 mt-4">

                        No teacher assignments found.

                    </p>

                )}

            </div>

        </div>

    );
}