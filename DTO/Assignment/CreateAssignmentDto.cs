namespace AssignFlow.DTO.Assignment;

public class CreateAssignmentDto
{
    public Guid ClassId { get; set; }

    public Guid SubjectId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime Deadline { get; set; }

    public int MaxMarks { get; set; }
}