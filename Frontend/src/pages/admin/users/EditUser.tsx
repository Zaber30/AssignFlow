import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

import {
    getUserById,
    updateUser
} from "../../../api/userApi";

import type { UpdateUserRequest } from "../../../types/UpdateUserRequest";
export default function EditUser() {

    const { id } = useParams();

    const navigate = useNavigate();

    const {

        register,

        handleSubmit,

        reset,

        formState: { isSubmitting }

    } = useForm<UpdateUserRequest>();

    useEffect(() => {

        const load = async () => {

            if (!id) return;

            const user = await getUserById(id);

            reset({

                fullName: user.fullName,

                email: user.email,

                role:
                    user.role === "Admin"
                        ? 1
                        : user.role === "Teacher"
                            ? 2
                            : 0,

                isActive: user.isActive

            });
        };

        load();

    }, [id, reset]);

    const onSubmit = async (

        data: UpdateUserRequest

    ) => {

        if (!id) return;

        await updateUser(id, data);

        navigate("/admin/users");

    };

    return (

        <div className="max-w-xl bg-white shadow rounded-lg p-6">

            <h1 className="text-3xl font-bold mb-5">

                Edit User

            </h1>

            <form

                onSubmit={handleSubmit(onSubmit)}

                className="space-y-4"

            >

                <input

                    className="border p-2 w-full"

                    placeholder="Full Name"

                    {...register("fullName")}

                />

                <input

                    className="border p-2 w-full"

                    placeholder="Email"

                    {...register("email")}

                />

                <input

                    className="border p-2 w-full"

                    type="password"

                    placeholder="Leave blank to keep password"

                    {...register("password")}

                />

                <select

                    className="border p-2 w-full"

                    {...register("role", {

                        valueAsNumber: true

                    })}

                >

                    <option value={1}>Admin</option>

                    <option value={2}>Teacher</option>

                    <option value={0}>Student</option>

                </select>

                <button

                    className="bg-blue-600 text-white px-5 py-2 rounded"

                    disabled={isSubmitting}

                >

                    Save

                </button>

            </form>

        </div>

    );

}