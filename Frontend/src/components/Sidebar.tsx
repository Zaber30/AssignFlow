import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function Sidebar() {

    const { user } = useAuth();

    return (

        <div className="w-64 min-h-screen bg-slate-800 text-white">

            <div className="text-center text-2xl font-bold py-6">

                Dashboard

            </div>

            <div className="flex flex-col">

                {
                    user?.role === "Admin" &&

                    <>
                        <Link
                            to="/admin"
                            className="p-4 hover:bg-slate-700"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/admin/users"
                            className="p-4 hover:bg-slate-700"
                        >
                            Users
                        </Link>

                        <Link
                            to="/admin/classes"
                            className="p-4 hover:bg-slate-700"
                        >
                            Classes
                        </Link>

                        <Link
                            to="/admin/subjects"
                            className="p-4 hover:bg-slate-700"
                        >
                            Subjects
                        </Link>

                        <Link
                            to="/admin/teacher-subjects"
                            className="p-4 hover:bg-slate-700"
                        >
                            Teacher Subjects
                        </Link>

                    </>
                }

                {
                    user?.role === "Teacher" &&

                    <>
                        <Link
                            to="/teacher"
                            className="p-4 hover:bg-slate-700"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/teacher/assignments"
                            className="p-4 hover:bg-slate-700"
                        >
                            Assignments
                        </Link>

                    </>
                }

                {
                    user?.role === "Student" &&

                    <>
                        <Link
                            to="/student"
                            className="p-4 hover:bg-slate-700"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/student/assignments"
                            className="p-4 hover:bg-slate-700"
                        >
                            Assignments
                        </Link>

                    </>
                }

            </div>

        </div>

    );
}