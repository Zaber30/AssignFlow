import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import UserList from "../pages/admin/users/UserList";
import CreateUser from "../pages/admin/users/CreateUser";
import ClassList from "../pages/admin/Classes/ClassList";
import CreateClass from "../pages/admin/Classes/CreateClass";

import EditUser from "../pages/admin/users/EditUser";
import SubjectList from "../pages/admin/Subjects/SubjectList";
import CreateSubject from "../pages/admin/Subjects/CreateSubject";
import TeacherSubjectList
    from "../pages/admin/teacherSubjects/TeacherSubjectList";

import AssignTeacherSubject
    from "../pages/admin/teacherSubjects/AssignTeacherSubject";
import AssignmentList
    from "../pages/teacher/assignments/AssignmentList";
import CreateAssignment
    from "../pages/teacher/assignments/CreateAssignment";
import StudentAssignmentList
    from "../pages/student/assignments/AssignmentList";
import AssignmentDetails
    from "../pages/student/assignments/AssignmentDetails";
import SubmissionList
    from "../pages/teacher/submissions/SubmissionList";

import ReviewSubmission
    from "../pages/teacher/submissions/ReviewSubmission";
import AdminLayout from "../layouts/AdminLayout";
import TeacherLayout from "../layouts/TeacherLayout";
import StudentLayout from "../layouts/StudentLayout";

import ProtectedRoute from "../components/ProtectedRoute";
import RoleRoute from "../components/RoleRoute";

import AdminDashboard from "../pages/admin/Dashboard";
import TeacherDashboard from "../pages/teacher/Dashboard";
import StudentDashboard from "../pages/student/Dashboard";

export default function AppRoutes() {

    return (

        <Routes>

            {/* Login */}
            <Route
                path="/"
                element={<Login />}
            />

            {/* ================= ADMIN ================= */}

            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <RoleRoute role="Admin">
                            <AdminLayout />
                        </RoleRoute>
                    </ProtectedRoute>
                }
            >

                <Route
                    index
                    element={<AdminDashboard />}
                />
                <Route

                    path="users"

                    element={<UserList />}

                />
                <Route

                    path="users/create"

                    element={<CreateUser />}

                />
                <Route

                path="users/edit/:id"

                element={<EditUser />}

                />
                <Route

                    path="classes"

                    element={<ClassList />}

                />

                <Route

                    path="classes/create"

                    element={<CreateClass />}

                />
                <Route
                    path="subjects"
                    element={<SubjectList />}
                />

                <Route
                    path="subjects/create"
                    element={<CreateSubject />}
                />
                <Route
                    path="teacher-subjects"
                    element={<TeacherSubjectList />}
                />

                <Route
                    path="teacher-subjects/create"
                    element={<AssignTeacherSubject />}
                />

            </Route>

            {/* ================= TEACHER ================= */}
            
            <Route
                path="/teacher"
                element={
                    <ProtectedRoute>
                        <RoleRoute role="Teacher">
                            <TeacherLayout />
                        </RoleRoute>
                    </ProtectedRoute>
                }
            >
                {/* Teacher Dashboard */}
                <Route
                    index
                    element={<TeacherDashboard />}
                />

                {/* Teacher Assignments */}
                <Route
                    path="assignments"
                    element={<AssignmentList />}
                />
                <Route path="assignments/create" 
                       element={<CreateAssignment />} />
                <Route
                    path="assignments/:assignmentId/submissions"
                    element={<SubmissionList />}
                />

                <Route
                    path="submissions/:id/review"
                    element={<ReviewSubmission />}
                />

            </Route>


            {/* ================= STUDENT ================= */}

            <Route
                path="/student"
                element={
                    <ProtectedRoute>
                        <RoleRoute role="Student">
                            <StudentLayout />
                        </RoleRoute>
                    </ProtectedRoute>
                }
            >

                <Route
                    index
                    element={<StudentDashboard />}
                />
                <Route path="assignments" 
                       element={<StudentAssignmentList />} />
                <Route
                    path="assignments/:id"
                    element={<AssignmentDetails />}
                />

            </Route>

        </Routes>

    );
}