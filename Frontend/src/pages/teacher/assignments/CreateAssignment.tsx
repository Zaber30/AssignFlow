
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
    createAssignment,
    getMyTeaching
} from "../../../api/assignmentApi";

import type { MyTeachingResponse } from "../../../types/MyTeachingResponse";


// ==========================================
// Form type
// ==========================================

interface AssignmentForm {

    teachingId: string;

    title: string;

    description: string;

    deadline: string;

    maxMarks: number;
}


// ==========================================
// Component
// ==========================================

export default function CreateAssignment() {

    const navigate = useNavigate();


    // ======================================
    // State
    // ======================================

    const [teaching, setTeaching] =
        useState<MyTeachingResponse[]>([]);

    const [loadingData, setLoadingData] =
        useState(true);

    const [error, setError] =
        useState("");


    // ======================================
    // React Hook Form
    // ======================================

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isSubmitting
        }
    } = useForm<AssignmentForm>();


    // ======================================
    // Load Teacher's Class + Subject
    // ======================================

    useEffect(() => {

        const loadTeaching = async () => {

            try {

                setLoadingData(true);

                setError("");

                const data =
                    await getMyTeaching();

                console.log(
                    "My teaching:",
                    data
                );

                setTeaching(data);

            }
            catch (err: any) {

                console.error(
                    "Failed to load teaching:",
                    err
                );

                setError(
                    err.response?.data?.message ??
                    "Failed to load your assigned classes and subjects."
                );

            }
            finally {

                setLoadingData(false);

            }

        };


        loadTeaching();

    }, []);


    // ======================================
    // Submit Assignment
    // ======================================

    const onSubmit = async (
        data: AssignmentForm
    ) => {

        try {

            setError("");


            // Find selected Class + Subject
            const selectedTeaching =
                teaching.find(
                    item =>
                        item.id === data.teachingId
                );


            // Make sure selection exists
            if (!selectedTeaching) {

                setError(
                    "Please select a valid class and subject."
                );

                return;
            }


            // ==================================
            // Send data to backend
            // ==================================

            const request = {

                classId:
                    selectedTeaching.classId,

                subjectId:
                    selectedTeaching.subjectId,

                title:
                    data.title,

                description:
                    data.description,

                deadline:
                    data.deadline,

                maxMarks:
                    Number(data.maxMarks)

            };


            console.log(
                "Create Assignment Request:",
                request
            );


            await createAssignment(request);


            // ==================================
            // Success
            // ==================================

            navigate(
                "/teacher/assignments"
            );

        }
        catch (err: any) {

            console.error(
                "Create assignment failed:",
                err
            );


            setError(
                err.response?.data?.message ??
                "Failed to create assignment."
            );

        }

    };


    // ======================================
    // Loading
    // ======================================

    if (loadingData) {

        return (

            <div className="p-6">

                <h1 className="text-3xl font-bold">
                    Create Assignment
                </h1>

                <p className="mt-4 text-gray-500">
                    Loading your assigned classes and subjects...
                </p>

            </div>

        );

    }


    // ======================================
    // Page
    // ======================================

    return (

        <div className="p-6">

            <div className="max-w-2xl mx-auto">


                {/* ================================= */}
                {/* Header */}
                {/* ================================= */}

                <div className="mb-6">

                    <h1 className="text-3xl font-bold">
                        Create Assignment
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Create an assignment for your assigned class.
                    </p>

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
                {/* No Teaching Assignment */}
                {/* ================================= */}

                {teaching.length === 0 && !error && (

                    <div className="mb-5 p-4 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded">

                        You have not been assigned to any
                        class and subject yet.

                    </div>

                )}


                {/* ================================= */}
                {/* Form */}
                {/* ================================= */}

                {teaching.length > 0 && (

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="bg-white rounded-lg shadow p-6 space-y-5"
                    >


                        {/* =============================== */}
                        {/* Class + Subject */}
                        {/* =============================== */}

                        <div>

                            <label className="block font-medium mb-1">

                                Class & Subject

                            </label>


                            <select
                                className="w-full border rounded p-2"
                                {...register(
                                    "teachingId",
                                    {
                                        required:
                                            "Please select a class and subject."
                                    }
                                )}
                            >

                                <option value="">

                                    Select Class & Subject

                                </option>


                                {teaching.map(
                                    (item) => (

                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >

                                            {item.className}
                                            {" - "}
                                            {item.subjectName}

                                        </option>

                                    )
                                )}

                            </select>


                            {errors.teachingId && (

                                <p className="text-red-500 text-sm mt-1">

                                    {
                                        errors
                                            .teachingId
                                            .message
                                    }

                                </p>

                            )}

                        </div>


                        {/* =============================== */}
                        {/* Title */}
                        {/* =============================== */}

                        <div>

                            <label className="block font-medium mb-1">

                                Assignment Title

                            </label>


                            <input
                                type="text"
                                placeholder="Enter assignment title"
                                className="w-full border rounded p-2"
                                {...register(
                                    "title",
                                    {
                                        required:
                                            "Title is required."
                                    }
                                )}
                            />


                            {errors.title && (

                                <p className="text-red-500 text-sm mt-1">

                                    {
                                        errors
                                            .title
                                            .message
                                    }

                                </p>

                            )}

                        </div>


                        {/* =============================== */}
                        {/* Description */}
                        {/* =============================== */}

                        <div>

                            <label className="block font-medium mb-1">

                                Description

                            </label>


                            <textarea
                                rows={5}
                                placeholder="Enter assignment description"
                                className="w-full border rounded p-2"
                                {...register(
                                    "description",
                                    {
                                        required:
                                            "Description is required."
                                    }
                                )}
                            />


                            {errors.description && (

                                <p className="text-red-500 text-sm mt-1">

                                    {
                                        errors
                                            .description
                                            .message
                                    }

                                </p>

                            )}

                        </div>


                        {/* =============================== */}
                        {/* Deadline */}
                        {/* =============================== */}

                        <div>

                            <label className="block font-medium mb-1">

                                Deadline

                            </label>


                            <input
                                type="datetime-local"
                                className="w-full border rounded p-2"
                                {...register(
                                    "deadline",
                                    {
                                        required:
                                            "Deadline is required."
                                    }
                                )}
                            />


                            {errors.deadline && (

                                <p className="text-red-500 text-sm mt-1">

                                    {
                                        errors
                                            .deadline
                                            .message
                                    }

                                </p>

                            )}

                        </div>


                        {/* =============================== */}
                        {/* Max Marks */}
                        {/* =============================== */}

                        <div>

                            <label className="block font-medium mb-1">

                                Maximum Marks

                            </label>


                            <input
                                type="number"
                                min="1"
                                placeholder="Enter maximum marks"
                                className="w-full border rounded p-2"
                                {...register(
                                    "maxMarks",
                                    {
                                        required:
                                            "Maximum marks is required.",

                                        min: {
                                            value: 1,

                                            message:
                                                "Marks must be at least 1."
                                        },

                                        valueAsNumber: true
                                    }
                                )}
                            />


                            {errors.maxMarks && (

                                <p className="text-red-500 text-sm mt-1">

                                    {
                                        errors
                                            .maxMarks
                                            .message
                                    }

                                </p>

                            )}

                        </div>


                        {/* =============================== */}
                        {/* Buttons */}
                        {/* =============================== */}

                        <div className="flex gap-3 pt-3">


                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/teacher/assignments"
                                    )
                                }
                                className="px-4 py-2 border rounded hover:bg-gray-100"
                            >

                                Cancel

                            </button>


                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                            >

                                {isSubmitting
                                    ? "Creating..."
                                    : "Create Assignment"}

                            </button>

                        </div>


                    </form>

                )}

            </div>

        </div>

    );

};