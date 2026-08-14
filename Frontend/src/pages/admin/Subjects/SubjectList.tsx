import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getSubjects } from "../../../api/subjectApi";
import type { SubjectResponse } from "../../../types/SubjectResponse";

export default function SubjectList() {

    const [subjects, setSubjects] = useState<SubjectResponse[]>([]);
    const [loading, setLoading] = useState(true);

    const loadSubjects = async () => {

        try {

            const data = await getSubjects();

            setSubjects(data);

        }
        catch (error) {

            console.error("Failed to load subjects:", error);

        }
        finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadSubjects();

    }, []);

    if (loading) {

        return (
            <h2 className="text-xl">
                Loading subjects...
        </h2>
    );

    }

    return (

        <div>

            <div className="flex justify-between items-center mb-5">

        <h1 className="text-3xl font-bold">
            Subjects
            </h1>

            <Link
    to="/admin/subjects/create"
    className="bg-blue-600 text-white px-4 py-2 rounded"
        >
        Add Subject
    </Link>

    </div>

    <table className="w-full border">

    <thead className="bg-gray-200">

    <tr>

        <th className="border p-2">
        Name
        </th>

        <th className="border p-2">
        Code
        </th>

        </tr>

        </thead>

        <tbody>

        {subjects.map(subject => (

                <tr key={subject.id}>

                <td className="border p-2">
                    {subject.name}
                    </td>

                    <td className="border p-2">
                {subject.code}
                </td>

                </tr>

))}

    </tbody>

    </table>

    {subjects.length === 0 && (

        <p className="text-gray-500 mt-4">
            No subjects found.
    </p>

    )}

    </div>

);
}