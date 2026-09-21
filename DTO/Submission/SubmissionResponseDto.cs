using AssignFlow.Models.Enums;

namespace AssignFlow.DTO.Submission;

public class SubmissionResponseDto
{
    public Guid Id { get; set; }

    public Guid AssignmentId { get; set; }

    public string AssignmentTitle { get; set; } = string.Empty;

    public Guid StudentId { get; set; }

    public string StudentName { get; set; } = string.Empty;

    public DateTime SubmittedAt { get; set; }

    public int? Marks { get; set; }

    public SubmissionStatus Status { get; set; }
}