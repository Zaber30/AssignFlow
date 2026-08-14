namespace OnnorokomProjucti.Models.Entities;

public class Subject:BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public ICollection<TeacherSubject> TeacherSubjects { get; set; }
        = new List<TeacherSubject>();

    public ICollection<Assignment> Assignments { get; set; }
        = new List<Assignment>();
}