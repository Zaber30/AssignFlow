**Assignment & Submission Management System for a school or college
A full-stack Assignment Management System built with **ASP.NET Core Web API** and **React + TypeScript**.

The system provides role-based access for:

- Admin
- Teacher
- Student

It allows administrators to manage users, classes, subjects, and teacher assignments. Teachers can create and publish assignments, while students can view published assignments and submit their answers. Teachers can then review student submissions and provide marks and feedback.

---

## Features

### Authentication & Authorization

- JWT-based authentication
- Role-based authorization
- Three user roles:
    - Admin
    - Teacher
    - Student
- Protected frontend routes
- Backend API authorization using ASP.NET Core `[Authorize]`

## Admin Features
- View all users
- View a single user
- Create users
- Update users
- Delete users
- Assign roles
- View classes
- Create classes
- View subjects
- Create subjects
- Admin can assign Teacher,subject,class

## Teacher Features
- View their assigned classes and subjects
- Create assignments
- View their assignments
- Publish assignments
- View student submissions
## Student Features

Students can:

- View all published assignments
- View assignment details
- Submit assignments

# Technology Stack

## Backend

- ASP.NET Core Web API
- Entity Framework Core
- C#
- JWT Authentication
- BCrypt password hashing
- SQL Server
- Swagger / OpenAPI


## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
