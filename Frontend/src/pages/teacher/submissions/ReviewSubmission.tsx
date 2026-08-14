import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getSubmissionById,
    reviewSubmission
} from "../../../api/submissionApi";

import type {
    SubmissionDetails
} from "../../../types/SubmissionDetails";


export default function ReviewSubmission() {

    const { id } = useParams<{
        id: string;
    }>();

    const navigate = useNavigate();

    const [submission, setSubmission] =
        useState<SubmissionDetails | null>(null);

    const [marks, setMarks] =
        useState("");

    const [feedback, setFeedback] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    // =====================================================
    // Load submission
    // =====================================================

    useEffect(() => {

        const loadSubmission = async () => {

            if (!id) {
                setError("Submission ID is missing.");
                setLoading(false);
                return;
            }

            try {

                setLoading(true);
                setError("");

                const data =
                    await getSubmissionById(id);

                setSubmission(data);

                if (data.marks !== null) {
                    setMarks(
                        data.marks.toString()
                    );
                }

                setFeedback(
                    data.feedback ?? ""
                );

            }
            catch (err: any) {

                console.error(
                    "Failed to load submission:",
                    err
                );

                setError(
                    err.response?.data?.message ??
                    "Failed to load submission."
                );

            }
            finally {

                setLoading(false);

            }
        };

        loadSubmission();

    }, [id]);


    // =====================================================
    // Review submission
    // =====================================================

    const handleReview = async () => {

        if (!id || !submission) {
            return;
        }

        setError("");
        setSuccess("");

        const numericMarks =
            Number(marks);

        if (marks.trim() === "") {

            setError(
                "Please enter marks."
            );

            return;
        }

        if (numericMarks < 0) {

            setError(
                "Marks cannot be negative."
            );

            return;
        }

        if (
            numericMarks >
            submission.maxMarks
        ) {

            setError(
                `Marks cannot exceed ${submission.maxMarks}.`
            );

            return;
        }


        try {

            setSaving(true);

            await reviewSubmission(
                id,
                {
                    marks: numericMarks,
                    feedback:
                        feedback.trim() ||
                        null
                }
            );

            setSuccess(
                "Submission reviewed successfully."
            );

        }
        catch (err: any) {

            console.error(
                "Review submission error:",
                err
            );

            setError(
                err.response?.data?.message ??
                "Failed to review submission."
            );

        }
        finally {

            setSaving(false);

        }
    };


    // =====================================================
    // Loading
    // =====================================================

    if (loading) {

        return (

            <div className="p-6">

                <h1 className="text-3xl font-bold">
                    Review Submission
                </h1>

                <p className="mt-4 text-gray-500">
                    Loading submission...
                </p>

            </div>
        );
    }


    // =====================================================
    // Error / not found
    // =====================================================

    if (!submission) {

        return (

            <div className="p-6">

                <div className="bg-red-100 border border-red-300 text-red-700 p-4 rounded">
                    {error || "Submission not found."}
                </div>

            </div>
        );
    }


    // =====================================================
    // Page
    // =====================================================

    return (

        <div className="p-6 max-w-5xl">

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

                <div>

                    <h1 className="text-3xl font-bold">
                        Review Submission
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Review the student's answer and give marks.
                    </p>

                </div>

                <button
                    onClick={() =>
                        navigate(
                            `/teacher/assignments/${submission.assignmentId}/submissions`
                        )
                    }
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                >
                    Back to Submissions
                </button>

            </div>


            {/* Error */}

            {error && (

                <div className="mb-5 p-4 bg-red-100 border border-red-300 text-red-700 rounded">

                    {error}

                </div>

            )}


            {/* Success */}

            {success && (

                <div className="mb-5 p-4 bg-green-100 border border-green-300 text-green-700 rounded">

                    {success}

                </div>

            )}


            {/* Submission Information */}

            <div className="bg-white rounded-lg shadow p-6 mb-6">

                <h2 className="text-xl font-semibold mb-5">
                    Submission Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>

                        <p className="text-sm text-gray-500">
                            Assignment
                        </p>

                        <p className="font-semibold mt-1">
                            {submission.assignmentTitle}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-gray-500">
                            Student
                        </p>

                        <p className="font-semibold mt-1">
                            {submission.studentName}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-gray-500">
                            Submitted At
                        </p>

                        <p className="font-semibold mt-1">
                            {new Date(
                                submission.submittedAt
                            ).toLocaleString()}
                        </p>

                    </div>


                    <div>

                        <p className="text-sm text-gray-500">
                            Maximum Marks
                        </p>

                        <p className="font-semibold mt-1">
                            {submission.maxMarks}
                        </p>

                    </div>

                </div>

            </div>


            {/* Student Answer */}

            <div className="bg-white rounded-lg shadow p-6 mb-6">

                <h2 className="text-xl font-semibold mb-4">
                    Student Answer
                </h2>

                <div className="border rounded-lg p-5 bg-gray-50 whitespace-pre-line">

                    {submission.answer}

                </div>


                {submission.attachmentUrl && (

                    <div className="mt-5">

                        <a
                            href={
                                submission.attachmentUrl
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:underline"
                        >
                            View Attachment
                        </a>

                    </div>

                )}

            </div>


            {/* Review */}

            <div className="bg-white rounded-lg shadow p-6">

                <h2 className="text-xl font-semibold mb-5">
                    Review
                </h2>


                {/* Marks */}

                <div className="mb-5">

                    <label className="block text-sm font-medium mb-2">
                        Marks
                    </label>

                    <input
                        type="number"
                        min="0"
                        max={submission.maxMarks}
                        value={marks}
                        onChange={(e) =>
                            setMarks(e.target.value)
                        }
                        className="w-full border rounded-lg px-4 py-2"
                        placeholder={`Enter marks (0-${submission.maxMarks})`}
                    />

                </div>


                {/* Feedback */}

                <div className="mb-6">

                    <label className="block text-sm font-medium mb-2">
                        Feedback
                    </label>

                    <textarea
                        value={feedback}
                        onChange={(e) =>
                            setFeedback(
                                e.target.value
                            )
                        }
                        rows={5}
                        className="w-full border rounded-lg px-4 py-3"
                        placeholder="Write feedback for the student..."
                    />

                </div>


                {/* Save */}

                <button
                    onClick={handleReview}
                    disabled={saving}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >

                    {saving
                        ? "Saving..."
                        : "Save Review"}

                </button>

            </div>

        </div>
    );
}