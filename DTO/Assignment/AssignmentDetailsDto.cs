using OnnorokomProjucti.Models.Enums;

namespace OnnorokomProjucti.DTO.Assignment;

public class AssignmentDetailsDto
{
    public Guid Id { get; set; }

    public Guid TeacherId { get; set; }

    public string TeacherName { get; set; } = string.Empty;

    public Guid ClassId { get; set; }

    public string ClassName { get; set; } = string.Empty;

    public Guid SubjectId { get; set; }

    public string SubjectName { get; set; } = string.Empty;

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime Deadline { get; set; }

    public int MaxMarks { get; set; }

    public AssignmentStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
}