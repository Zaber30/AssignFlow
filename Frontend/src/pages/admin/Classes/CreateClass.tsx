import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { createClass } from "../../../api/classApi";
import type { CreateClassRequest } from "../../../types/CreateClassRequest";

export default function CreateClass() {

    const navigate = useNavigate();

    const {

        register,

        handleSubmit,

        formState: { errors, isSubmitting }

    } = useForm<CreateClassRequest>();

    const onSubmit = async (

        data: CreateClassRequest

    ) => {

        try {

            await createClass(data);

            alert("Class created successfully.");

            navigate("/admin/classes");

        }
        catch (error) {

            console.error(error);

            alert("Failed to create class.");

        }

    };

    return (

        <div className="max-w-xl bg-white shadow rounded-lg p-6">

            <h1 className="text-3xl font-bold mb-6">

                Create Class

            </h1>

            <form

                onSubmit={handleSubmit(onSubmit)}

                className="space-y-5"

            >

                <div>

                    <label>

                        Class Name

                    </label>

                    <input

                        className="w-full border rounded p-2"

                        {...register("name", {

                            required: "Class name is required"

                        })}

                    />

                    <p className="text-red-500">

                        {errors.name?.message}

                    </p>

                </div>

                <button

                    disabled={isSubmitting}

                    className="bg-blue-600 text-white px-5 py-2 rounded"

                >

                    {

                        isSubmitting

                            ? "Creating..."

                            : "Create Class"

                    }

                </button>

            </form>

        </div>

    );

}