import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getClasses } from "../../../api/classApi";
import type { ClassResponse } from "../../../types/ClassResponse";

export default function ClassList() {

    const [classes, setClasses] = useState<ClassResponse[]>([]);

    const [loading, setLoading] = useState(true);

    const loadClasses = async () => {

        try {

            const data = await getClasses();

            setClasses(data);

        }
        catch (error) {

            console.error(error);

        }
        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        loadClasses();

    }, []);

    if (loading)
        return <h2>Loading...</h2>;

    return (

        <div>

            <div className="flex justify-between items-center mb-5">

                <h1 className="text-3xl font-bold">

                    Classes

                </h1>

                <Link

                    to="/admin/classes/create"

                    className="bg-blue-600 text-white px-4 py-2 rounded"

                >

                    Add Class

                </Link>

            </div>

            <table className="w-full border">

                <thead className="bg-gray-200">

                <tr>

                    <th className="border p-2">

                        Name

                    </th>

                    <th className="border p-2">

                        Description

                    </th>

                </tr>

                </thead>

                <tbody>

                {

                    classes.map(c => (

                        <tr key={c.id}>

                            <td className="border p-2">

                                {c.name}

                            </td>

                            <td className="border p-2">

                                {c.description ?? "-"}

                            </td>

                        </tr>

                    ))

                }

                </tbody>

            </table>

        </div>

    );

}