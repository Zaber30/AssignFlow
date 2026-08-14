namespace OnnorokomProjucti.DTO.TeacherSubject;

public class TeacherSubjectResponseDto
{
    public Guid Id { get; set; }

    public Guid TeacherId { get; set; }

    public string TeacherName { get; set; } = string.Empty;

    public Guid ClassId { get; set; }

    public string ClassName { get; set; } = string.Empty;

    public Guid SubjectId { get; set; }

    public string SubjectName { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}