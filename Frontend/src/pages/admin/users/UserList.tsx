import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { deleteUser, getUsers } from "../../../api/userApi";
import type { UserResponse } from "../../../types/UserResponse";

export default function UserList() {

    const [users, setUsers] = useState<UserResponse[]>([]);

    const [loading, setLoading] = useState(true);

    const loadUsers = async () => {

        try {

            const data = await getUsers();

            setUsers(data);

        }
        catch (error) {

            console.error(error);

        }
        finally {

            setLoading(false);

        }
    };

    useEffect(() => {

        loadUsers();

    }, []);

    const handleDelete = async (id: string) => {

        if (!window.confirm("Delete this user?"))
            return;

        try {

            await deleteUser(id);

            loadUsers();

        }
        catch (error) {

            console.error(error);

            alert("Delete failed.");

        }

    };

    if (loading)
        return <h2 className="text-xl">Loading...</h2>;

    return (

        <div>

            <div className="flex justify-between items-center mb-5">

                <h1 className="text-3xl font-bold">

                    Users

                </h1>

                <Link

                    to="/admin/users/create"

                    className="bg-blue-600 text-white px-4 py-2 rounded"

                >

                    Add User

                </Link>

            </div>

            <table className="w-full border">

                <thead className="bg-gray-200">

                <tr>

                    <th className="border p-2">Name</th>

                    <th className="border p-2">Email</th>

                    <th className="border p-2">Role</th>

                    <th className="border p-2">Status</th>

                    <th className="border p-2">Action</th>

                </tr>

                </thead>

                <tbody>

                {

                    users.map(user => (

                        <tr key={user.id}>

                            <td className="border p-2">

                                {user.fullName}

                            </td>

                            <td className="border p-2">

                                {user.email}

                            </td>

                            <td className="border p-2">

                                {user.role}

                            </td>

                            <td className="border p-2">

                                {

                                    user.isActive
                                        ? "Active"
                                        : "Inactive"

                                }

                            </td>

                            <td className="border p-2">

                                <button

                                    onClick={() => handleDelete(user.id)}

                                    className="bg-red-500 text-white px-3 py-1 rounded"

                                >

                                    Delete

                                </button>

                            </td>

                            <td className="border p-2 space-x-2">

                                <Link

                                    to={`/admin/users/edit/${user.id}`}

                                    className="bg-green-600 text-white px-3 py-1 rounded"

                                >

                                    Edit

                                </Link>

                                <button

                                    onClick={() => handleDelete(user.id)}

                                    className="bg-red-600 text-white px-3 py-1 rounded"

                                >

                                    Delete

                                </button>

                            </td>

                        </tr>

                    ))

                }

                </tbody>

            </table>

        </div>

    );

}