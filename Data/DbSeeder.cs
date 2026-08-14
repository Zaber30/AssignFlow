using Microsoft.EntityFrameworkCore;
using OnnorokomProjucti.Models.Entities;
using OnnorokomProjucti.Models.Enums;

namespace OnnorokomProjucti.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(ApplicationDbContext context)
    {
        // Make sure database exists and migrations are applied
        await context.Database.MigrateAsync();

        // ==========================================
        // ADMIN
        // ==========================================

        var adminEmail = "admin@example.com";

        var adminExists = await context.Users
            .AnyAsync(u => u.Email == adminEmail);

        if (!adminExists)
        {
            var admin = new User
            {
                Id = Guid.NewGuid(),
                FullName = "System Admin",
                Email = adminEmail,
                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Role = UserRole.Admin,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(admin);
        }


        // ==========================================
        // TEACHER
        // ==========================================

        var teacherEmail = "teacher@example.com";

        var teacherExists = await context.Users
            .AnyAsync(u => u.Email == teacherEmail);

        if (!teacherExists)
        {
            var teacher = new User
            {
                Id = Guid.NewGuid(),
                FullName = "Demo Teacher",
                Email = teacherEmail,
                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword("Teacher@123"),
                Role = UserRole.Teacher,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(teacher);
        }


        // ==========================================
        // STUDENT
        // ==========================================

        var studentEmail = "student@example.com";

        var studentExists = await context.Users
            .AnyAsync(u => u.Email == studentEmail);

        if (!studentExists)
        {
            var student = new User
            {
                Id = Guid.NewGuid(),
                FullName = "Demo Student",
                Email = studentEmail,
                PasswordHash =
                    BCrypt.Net.BCrypt.HashPassword("Student@123"),
                Role = UserRole.Student,
                IsActive = true,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(student);
        }


        // ==========================================
        // SAVE
        // ==========================================

        await context.SaveChangesAsync();
    }
}