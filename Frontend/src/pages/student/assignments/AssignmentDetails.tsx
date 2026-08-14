import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getStudentAssignmentById
} from "../../../api/studentAssignmentApi";

import {
    submitAssignment
} from "../../../api/submissionApi.ts";

import type {
    AssignmentDetails as AssignmentDetailsType
} from "../../../types/AssignmentDetails";

export default function AssignmentDetails() {

    const { id } = useParams<{ id: string }>();

    const navigate = useNavigate();

    // ==========================================
    // Assignment state
    // ==========================================

    const [assignment, setAssignment] =
        useState<AssignmentDetailsType | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // ==========================================
    // Submission state
    // ==========================================

    const [answer, setAnswer] =
        useState("");

    const [submitting, setSubmitting] =
        useState(false);

    const [submitError, setSubmitError] =
        useState("");

    const [submitSuccess, setSubmitSuccess] =
        useState("");


    // ==========================================
    // Load assignment
    // ==========================================

    useEffect(() => {

        const loadAssignment = async () => {

            if (!id) {

                setError(
                    "Assignment ID is missing."
                );

                setLoading(false);

                return;
            }

            try {

                setLoading(true);

                setError("");

                const data =
                    await getStudentAssignmentById(id);

                console.log(
                    "Student assignment:",
                    data
                );

                setAssignment(data);

            }
            catch (err: any) {

                console.error(
                    "Failed to load assignment:",
                    err
                );

                setError(
                    err.response?.data?.message ??
                    "Failed to load assignment."
                );

            }
            finally {

                setLoading(false);

            }

        };

        loadAssignment();

    }, [id]);


    // ==========================================
    // Submit assignment
    // ==========================================

    const handleSubmitAssignment = async () => {

        if (!assignment) {
            return;
        }

        // Clear previous messages

        setSubmitError("");

        setSubmitSuccess("");


        // Validate answer

        if (!answer.trim()) {

            setSubmitError(
                "Please write your answer before submitting."
            );

            return;
        }


        try {

            setSubmitting(true);


            console.log(
                "Submitting assignment:",
                assignment.id
            );


            const response =
                await submitAssignment({

                    assignmentId:
                    assignment.id,

                    answer:
                        answer.trim(),

                    attachmentUrl:
                        null

                });


            console.log(
                "Submission response:",
                response
            );


            setSubmitSuccess(
                "Assignment submitted successfully."
            );


            // Clear answer

            setAnswer("");


        }
        catch (err: any) {

            console.error(
                "Submission error:",
                err
            );


            setSubmitError(
                err.response?.data?.message ??
                "Failed to submit assignment."
            );

        }
        finally {

            setSubmitting(false);

        }

    };


    // ==========================================
    // Loading
    // ==========================================

    if (loading) {

        return (

            <div className="p-6">

                <h1 className="text-3xl font-bold">
                    Assignment
                </h1>

                <p className="mt-4 text-gray-500">
                    Loading assignment...
                </p>

            </div>

        );

    }


    // ==========================================
    // Error loading assignment
    // ==========================================

    if (error) {

        return (

            <div className="p-6">

                <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded">

                    {error}

                </div>


                <button
                    onClick={() =>
                        navigate(
                            "/student/assignments"
                        )
                    }
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Back to Assignments
                </button>

            </div>

        );

    }


    // ==========================================
    // Assignment not found
    // ==========================================

    if (!assignment) {

        return (

            <div className="p-6">

                <p>
                    Assignment not found.
                </p>


                <button
                    onClick={() =>
                        navigate(
                            "/student/assignments"
                        )
                    }
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Back to Assignments
                </button>

            </div>

        );

    }


    // ==========================================
    // Page
    // ==========================================

    return (

        <div className="p-6 max-w-4xl mx-auto">


            {/* ================================= */}
            {/* Back button */}
            {/* ================================= */}

            <button
                onClick={() =>
                    navigate(
                        "/student/assignments"
                    )
                }
                className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
                ← Back to Assignments
            </button>


            {/* ================================= */}
            {/* Assignment information */}
            {/* ================================= */}

            <div className="bg-white rounded-lg shadow p-8">


                {/* Title */}

                <h1 className="text-3xl font-bold mb-3">

                    {assignment.title}

                </h1>


                {/* Status */}

                <span className="inline-block px-3 py-1 rounded-full text-sm bg-green-100 text-green-700 mb-6">

                    Published

                </span>


                {/* Description */}

                <div className="mb-6">

                    <h2 className="text-lg font-semibold mb-2">

                        Description

                    </h2>

                    <p className="text-gray-700 whitespace-pre-line">

                        {assignment.description}

                    </p>

                </div>


                {/* ================================= */}
                {/* Assignment information */}
                {/* ================================= */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">


                    {/* Teacher */}

                    <div className="border rounded p-4">

                        <p className="text-sm text-gray-500">

                            Teacher

                        </p>

                        <p className="font-semibold mt-1">

                            {assignment.teacherName}

                        </p>

                    </div>


                    {/* Class */}

                    <div className="border rounded p-4">

                        <p className="text-sm text-gray-500">

                            Class

                        </p>

                        <p className="font-semibold mt-1">

                            {assignment.className}

                        </p>

                    </div>


                    {/* Subject */}

                    <div className="border rounded p-4">

                        <p className="text-sm text-gray-500">

                            Subject

                        </p>

                        <p className="font-semibold mt-1">

                            {assignment.subjectName}

                        </p>

                    </div>


                    {/* Maximum marks */}

                    <div className="border rounded p-4">

                        <p className="text-sm text-gray-500">

                            Maximum Marks

                        </p>

                        <p className="font-semibold mt-1">

                            {assignment.maxMarks}

                        </p>

                    </div>


                    {/* Deadline */}

                    <div className="border rounded p-4 md:col-span-2">

                        <p className="text-sm text-gray-500">

                            Deadline

                        </p>

                        <p className="font-semibold mt-1">

                            {new Date(
                                assignment.deadline
                            ).toLocaleString()}

                        </p>

                    </div>

                </div>


                {/* ================================= */}
                {/* Submit assignment */}
                {/* ================================= */}

                <div className="mt-8 border-t pt-6">


                    <h2 className="text-xl font-semibold mb-4">

                        Submit Your Answer

                    </h2>


                    {/* Submit error */}

                    {submitError && (

                        <div className="mb-4 p-4 bg-red-100 border border-red-300 text-red-700 rounded">

                            {submitError}

                        </div>

                    )}


                    {/* Submit success */}

                    {submitSuccess && (

                        <div className="mb-4 p-4 bg-green-100 border border-green-300 text-green-700 rounded">

                            {submitSuccess}

                        </div>

                    )}


                    {/* Answer label */}

                    <label className="block font-medium mb-2">

                        Your Answer

                    </label>


                    {/* Answer */}

                    <textarea
                        value={answer}
                        onChange={(e) =>
                            setAnswer(
                                e.target.value
                            )
                        }
                        rows={10}
                        placeholder="Write your answer here..."
                        disabled={submitting}
                        className="w-full border rounded-lg p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    />


                    {/* Character count */}

                    <div className="text-sm text-gray-500 mt-2">

                        {answer.length} characters

                    </div>


                    {/* Submit button */}

                    <button
                        onClick={
                            handleSubmitAssignment
                        }
                        disabled={
                            submitting ||
                            !answer.trim()
                        }
                        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >

                        {submitting
                            ? "Submitting..."
                            : "Submit Assignment"}

                    </button>

                </div>

            </div>

        </div>

    );

}