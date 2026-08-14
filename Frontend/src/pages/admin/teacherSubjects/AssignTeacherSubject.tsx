import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import {
    assignTeacherSubject
} from "../../../api/teacherSubjectApi";

import { getUsers } from "../../../api/userApi";
import { getClasses } from "../../../api/classApi";
import { getSubjects } from "../../../api/subjectApi";

import type { AssignTeacherSubjectRequest }
    from "../../../types/AssignTeacherSubjectRequest";

import type { TeacherResponse }
    from "../../../types/TeacherResponse";

import type { ClassResponse }
    from "../../../types/ClassResponse";

import type { SubjectResponse }
    from "../../../types/SubjectResponse";


export default function AssignTeacherSubject() {

    const navigate = useNavigate();


    const [teachers, setTeachers] =
        useState<TeacherResponse[]>([]);

    const [classes, setClasses] =
        useState<ClassResponse[]>([]);

    const [subjects, setSubjects] =
        useState<SubjectResponse[]>([]);


    const [loading, setLoading] =
        useState(true);


    const [error, setError] =
        useState("");


    const {

        register,

        handleSubmit,

        formState: {
            errors,
            isSubmitting
        }

    } = useForm<AssignTeacherSubjectRequest>();


    useEffect(() => {

        const loadData = async () => {

            try {

                const [
                    usersData,
                    classesData,
                    subjectsData
                ] = await Promise.all([

                    getUsers(),

                    getClasses(),

                    getSubjects()

                ]);


                const teacherUsers =
                    usersData.filter(
                        user =>
                            user.role === 2 ||
                            user.role === "Teacher"
                    );


                setTeachers(teacherUsers);

                setClasses(classesData);

                setSubjects(subjectsData);

            }
            catch (error) {

                console.error(error);

                setError(
                    "Failed to load teachers, classes or subjects."
                );

            }
            finally {

                setLoading(false);

            }

        };


        loadData();

    }, []);


    const onSubmit = async (
        data: AssignTeacherSubjectRequest
    ) => {

        setError("");


        try {

            await assignTeacherSubject(data);


            alert(
                "Teacher assigned successfully."
            );


            navigate(
                "/admin/teacher-subjects"
            );

        }
        catch (error: any) {

            console.error(error);


            setError(
                error.response?.data?.message ??
                "Failed to assign teacher."
            );

        }

    };


    if (loading) {

        return (

            <div className="p-6">

                Loading data...

            </div>

        );

    }


    return (

        <div className="max-w-xl bg-white shadow rounded-lg p-6">

            <h1 className="text-3xl font-bold mb-6">

                Assign Teacher

            </h1>


            {error && (

                <div className="bg-red-100 text-red-700 p-3 rounded mb-5">

                    {error}

                </div>

            )}


            <form

                onSubmit={handleSubmit(onSubmit)}

                className="space-y-5"

            >


                {/* Teacher */}

                <div>

                    <label className="block mb-1">

                        Teacher

                    </label>


                    <select

                        className="w-full border rounded p-2"

                        {...register(
                            "teacherId",
                            {
                                required:
                                    "Teacher is required"
                            }
                        )}

                    >

                        <option value="">

                            Select Teacher

                        </option>


                        {teachers.map(
                            teacher => (

                                <option

                                    key={teacher.id}

                                    value={teacher.id}

                                >

                                    {teacher.fullName}
                                    {" - "}
                                    {teacher.email}

                                </option>

                            )
                        )}

                    </select>


                    {errors.teacherId && (

                        <p className="text-red-500 text-sm">

                            {errors.teacherId.message}

                        </p>

                    )}

                </div>


                {/* Class */}

                <div>

                    <label className="block mb-1">

                        Class

                    </label>


                    <select

                        className="w-full border rounded p-2"

                        {...register(
                            "classId",
                            {
                                required:
                                    "Class is required"
                            }
                        )}

                    >

                        <option value="">

                            Select Class

                        </option>


                        {classes.map(
                            classItem => (

                                <option

                                    key={classItem.id}

                                    value={classItem.id}

                                >

                                    {classItem.name}

                                </option>

                            )
                        )}

                    </select>


                    {errors.classId && (

                        <p className="text-red-500 text-sm">

                            {errors.classId.message}

                        </p>

                    )}

                </div>


                {/* Subject */}

                <div>

                    <label className="block mb-1">

                        Subject

                    </label>


                    <select

                        className="w-full border rounded p-2"

                        {...register(
                            "subjectId",
                            {
                                required:
                                    "Subject is required"
                            }
                        )}

                    >

                        <option value="">

                            Select Subject

                        </option>


                        {subjects.map(
                            subject => (

                                <option

                                    key={subject.id}

                                    value={subject.id}

                                >

                                    {subject.name}
                                    {" ("}
                                    {subject.code}
                                    {")"}

                                </option>

                            )
                        )}

                    </select>


                    {errors.subjectId && (

                        <p className="text-red-500 text-sm">

                            {errors.subjectId.message}

                        </p>

                    )}

                </div>


                <button

                    type="submit"

                    disabled={isSubmitting}

                    className="bg-blue-600 text-white px-5 py-2 rounded"

                >

                    {isSubmitting
                        ? "Assigning..."
                        : "Assign Teacher"
                    }

                </button>


            </form>

        </div>

    );
}