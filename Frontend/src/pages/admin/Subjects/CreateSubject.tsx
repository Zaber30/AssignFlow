import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { createSubject } from "../../../api/subjectApi";
import type { CreateSubjectRequest } from "../../../types/CreateSubjectRequest";

export default function CreateSubject() {

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<CreateSubjectRequest>();

    const onSubmit = async (data: CreateSubjectRequest) => {

        try {

            await createSubject(data);

            alert("Subject created successfully.");

            navigate("/admin/subjects");

        }
        catch (error) {

            console.error("Create subject failed:", error);

            alert("Failed to create subject.");

        }
    };

    return (

        <div className="max-w-xl bg-white shadow rounded-lg p-6">

            <h1 className="text-3xl font-bold mb-6">
                Create Subject
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
            >

                <div>

                    <label className="block mb-1">
                        Subject Name
                    </label>

                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        placeholder="Enter subject name"
                        {...register("name", {
                            required: "Subject name is required"
                        })}
                    />

                    {errors.name && (

                        <p className="text-red-500 text-sm mt-1">
                            {errors.name.message}
                        </p>

                    )}

                </div>

                <div>

                    <label className="block mb-1">
                        Subject Code
                    </label>

                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        placeholder="Enter subject code"
                        {...register("code", {
                            required: "Subject code is required"
                        })}
                    />

                    {errors.code && (

                        <p className="text-red-500 text-sm mt-1">
                            {errors.code.message}
                        </p>

                    )}

                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-5 py-2 rounded"
                >

                    {isSubmitting
                        ? "Creating..."
                        : "Create Subject"
                    }

                </button>

            </form>

        </div>

    );
}