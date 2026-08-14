Assignment & Submission Management System for a school or college
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

## Database

- Microsoft SQL Server
- Entity Framework Core migrations
- Seed data for demo users

## Prerequisites

.NET SDK 10
Node.js 20+ 
npm
SQL Server 2019+
Git

## Check installations:
```cpp
dotnet --version
node --version
npm --version
git --version
```

## Clone the Repository
 ```cpp
   git clone YOUR_GITHUB_REPOSITORY_URL
   cd OnnorokomProjucti
 ```
Resotere packages
```cpp
   dotnet restore
 ```

## Setting Database
create appsettings.json file
```cp 
cp appsettings.example.json appsettings.json
```
```cp 
 Configure the database connection:
{
"ConnectionStrings": {
"DefaultConnection": "Server=YOUR_SQL_SERVER;Database=AssignmentDB;User Id=YOUR_SQL_USER;Password=YOUR_SQL_PASSWORD;TrustServerCertificate=True;Encrypt=False;"
}
}
```
Replace:
```cpp
YOUR_SQL_SERVER → your SQL Server server
AssignmentDB → database name
YOUR_SQL_USER → SQL Server username
YOUR_SQL_PASSWORD → SQL Server password
```

## create database 
Run command
```cpp 
dotnet tool install --global dotnet-ef
dotnet ef migrations add InitialCreate
dotnet ef database update
```
## run the backend
Navigate to the backend project:
 ```cpp
cd. Backend/OnnorokomProjucti
dotnet run
```
The API should start on your configured URL, for example:

http://localhost:5064

## Run the frontend
run:
```cpp
npm run dev
```
Vite should display something similar to:

Local: http://localhost:5173/

Open that address in your browser.

15. Login

Use one of the seeded accounts.
```cpp
Admin
Email: admin@example.com
Password: Admin@123
Teacher
Email: teacher@example.com
Password: Teacher@123
Student
Email: student@example.com
Password: Student@123
```