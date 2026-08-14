namespace OnnorokomProjucti.DTO.Submission;

public class CreateSubmissionDto
{
    public Guid AssignmentId { get; set; }

    public string Answer { get; set; } = string.Empty;

    public string? AttachmentUrl { get; set; }
}