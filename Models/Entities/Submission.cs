namespace AssignFlow.Models.Entities;
using AssignFlow.Models.Enums;
public class Submission:BaseEntity
{
    public Guid AssignmentId { get; set; }

    public Guid StudentId { get; set; }

    public string Answer { get; set; } = string.Empty;

    public string? AttachmentUrl { get; set; }

    public DateTime SubmittedAt { get; set; }

    public int? Marks { get; set; }

    public string? Feedback { get; set; }

    public SubmissionStatus Status { get; set; }

    // Navigation

    public Assignment Assignment { get; set; } = null!;

    public User Student { get; set; } = null!;
    
}