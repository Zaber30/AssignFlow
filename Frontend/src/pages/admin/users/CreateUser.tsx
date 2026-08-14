import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { createUser } from "../../../api/userApi";
import type { CreateUserRequest } from "../../../types/CreateUserRequest";

export default function CreateUser() {

    const navigate = useNavigate();

    const {

        register,

        handleSubmit,

        formState: { errors, isSubmitting }

    } = useForm<CreateUserRequest>();

    const onSubmit = async (data: CreateUserRequest) => {

        try {

            await createUser(data);

            alert("User created successfully.");

            navigate("/admin/users");

        }
        catch (error) {

            console.error(error);

            alert("Failed to create user.");

        }

    };

    return (

        <div className="max-w-xl bg-white shadow rounded-lg p-6">

            <h1 className="text-3xl font-bold mb-6">

                Create User

            </h1>

            <form

                onSubmit={handleSubmit(onSubmit)}

                className="space-y-5"

            >

                <div>

                    <label className="block mb-1">

                        Full Name

                    </label>

                    <input

                        className="w-full border rounded p-2"

                        {...register("fullName", {

                            required: "Full name is required"

                        })}

                    />

                    <p className="text-red-500">

                        {errors.fullName?.message}

                    </p>

                </div>

                <div>

                    <label className="block mb-1">

                        Email

                    </label>

                    <input

                        type="email"

                        className="w-full border rounded p-2"

                        {...register("email", {

                            required: "Email is required"

                        })}

                    />

                    <p className="text-red-500">

                        {errors.email?.message}

                    </p>

                </div>

                <div>

                    <label className="block mb-1">

                        Password

                    </label>

                    <input

                        type="password"

                        className="w-full border rounded p-2"

                        {...register("password", {

                            required: "Password is required"

                        })}

                    />

                    <p className="text-red-500">

                        {errors.password?.message}

                    </p>

                </div>

                <div>

                    <label className="block mb-1">

                        Role

                    </label>

                    <select
                        className="w-full border rounded p-2"
                        {...register("role", {
                            valueAsNumber: true
                        })}
                    >
                        <option value={1}>Admin</option>
                        <option value={2}>Teacher</option>
                        <option value={3}>Student</option>
                    </select>

                </div>

                <button

                    disabled={isSubmitting}

                    className="bg-blue-600 text-white px-5 py-2 rounded"

                >

                    {

                        isSubmitting

                            ? "Creating..."

                            : "Create User"

                    }

                </button>

            </form>

        </div>

    );

}