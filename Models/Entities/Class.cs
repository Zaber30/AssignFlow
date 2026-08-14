namespace OnnorokomProjucti.Models.Entities;

public class Class :BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string? Description { get; set; }

    public ICollection<StudentClass> StudentClasses { get; set; }
        = new List<StudentClass>();

    public ICollection<TeacherSubject> TeacherSubjects { get; set; }
        = new List<TeacherSubject>();

    public ICollection<Assignment> Assignments { get; set; }
        = new List<Assignment>();
}