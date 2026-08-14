using OnnorokomProjucti.Models.Enums;

namespace OnnorokomProjucti.DTO.Submission;

public class SubmissionDetailsDto
{
    public Guid Id { get; set; }

    public Guid AssignmentId { get; set; }

    public string AssignmentTitle { get; set; } = string.Empty;

    public Guid StudentId { get; set; }

    public string StudentName { get; set; } = string.Empty;

    public string Answer { get; set; } = string.Empty;

    public string? AttachmentUrl { get; set; }

    public DateTime SubmittedAt { get; set; }

    public int? Marks { get; set; }

    public string? Feedback { get; set; }

    public SubmissionStatus Status { get; set; }

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }
    
}