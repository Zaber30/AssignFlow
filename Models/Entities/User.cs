namespace OnnorokomProjucti.Models.Entities;
using OnnorokomProjucti.Models.Enums;
public class User : BaseEntity
{
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public bool IsActive { get; set; } = true;

    // Navigation Properties

    // Student
    public ICollection<StudentClass> StudentClasses { get; set; }
        = new List<StudentClass>();

    public ICollection<Submission> Submissions { get; set; }
        = new List<Submission>();

    // Teacher
    public ICollection<TeacherSubject> TeacherSubjects { get; set; }
        = new List<TeacherSubject>();

    public ICollection<Assignment> Assignments { get; set; }
        = new List<Assignment>();
}