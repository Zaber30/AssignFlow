using Microsoft.EntityFrameworkCore;
using AssignFlow.Models;
using AssignFlow.Models.Entities;
namespace AssignFlow.Data;
public class ApplicationDbContext:DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): base(options)
    {
        
    }
    
    public DbSet<User> Users => Set<User>();

    public DbSet<Class> Classes => Set<Class>();

    public DbSet<Subject> Subjects => Set<Subject>();

    public DbSet<StudentClass> StudentClasses => Set<StudentClass>();

    public DbSet<TeacherSubject> TeacherSubjects => Set<TeacherSubject>();

    public DbSet<Assignment> Assignments => Set<Assignment>();

    public DbSet<Submission> Submissions => Set<Submission>();
    
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        ConfigureUser(builder);

        ConfigureStudentClass(builder);

        ConfigureTeacherSubject(builder);

        ConfigureAssignment(builder);

        ConfigureSubmission(builder);
    }

    //region Configurations

    private static void ConfigureUser(ModelBuilder builder)
    {
        builder.Entity<User>()
            .HasIndex(x => x.Email)
            .IsUnique();
    }

    private static void ConfigureStudentClass(ModelBuilder builder)
    {
        builder.Entity<StudentClass>()
            .HasOne(x => x.Student)
            .WithMany(x => x.StudentClasses)
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<StudentClass>()
            .HasOne(x => x.Class)
            .WithMany(x => x.StudentClasses)
            .HasForeignKey(x => x.ClassId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Entity<StudentClass>()
            .HasIndex(x => new { x.StudentId, x.ClassId })
            .IsUnique();
    }

    private static void ConfigureTeacherSubject(ModelBuilder builder)
    {
        builder.Entity<TeacherSubject>()
            .HasOne(x => x.Teacher)
            .WithMany(x => x.TeacherSubjects)
            .HasForeignKey(x => x.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<TeacherSubject>()
            .HasOne(x => x.Subject)
            .WithMany(x => x.TeacherSubjects)
            .HasForeignKey(x => x.SubjectId);

        builder.Entity<TeacherSubject>()
            .HasOne(x => x.Class)
            .WithMany(x => x.TeacherSubjects)
            .HasForeignKey(x => x.ClassId);

        builder.Entity<TeacherSubject>()
            .HasIndex(x => new { x.TeacherId, x.ClassId, x.SubjectId })
            .IsUnique();
    }

    private static void ConfigureAssignment(ModelBuilder builder)
    {
        builder.Entity<Assignment>()
            .HasOne(x => x.Teacher)
            .WithMany(x => x.Assignments)
            .HasForeignKey(x => x.TeacherId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Assignment>()
            .HasOne(x => x.Class)
            .WithMany(x => x.Assignments)
            .HasForeignKey(x => x.ClassId);

        builder.Entity<Assignment>()
            .HasOne(x => x.Subject)
            .WithMany(x => x.Assignments)
            .HasForeignKey(x => x.SubjectId);
    }

    private static void ConfigureSubmission(ModelBuilder builder)
    {
        builder.Entity<Submission>()
            .HasOne(x => x.Assignment)
            .WithMany(x => x.Submissions)
            .HasForeignKey(x => x.AssignmentId);

        builder.Entity<Submission>()
            .HasOne(x => x.Student)
            .WithMany(x => x.Submissions)
            .HasForeignKey(x => x.StudentId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.Entity<Submission>()
            .HasIndex(x => new { x.AssignmentId, x.StudentId })
            .IsUnique();
    }
}