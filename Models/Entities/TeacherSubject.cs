namespace AssignFlow.Models.Entities;

public class TeacherSubject:BaseEntity
{
    public Guid TeacherId { get; set; }

    public Guid SubjectId { get; set; }

    public Guid ClassId { get; set; }

    // Navigation

    public User Teacher { get; set; } = null!;

    public Subject Subject { get; set; } = null!;

    public Class Class { get; set; } = null!;
    
}