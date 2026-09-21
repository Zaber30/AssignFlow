namespace AssignFlow.Models.Entities;
using AssignFlow.Models.Enums;
public class Assignment:BaseEntity
{
    public Guid TeacherId { get; set; }

    public Guid ClassId { get; set; }

    public Guid SubjectId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime Deadline { get; set; }

    public int MaxMarks { get; set; }

    public AssignmentStatus Status { get; set; }

    // Navigation

    public User Teacher { get; set; } = null!;

    public Class Class { get; set; } = null!;

    public Subject Subject { get; set; } = null!;

    public ICollection<Submission> Submissions { get; set; }
        = new List<Submission>();
    
}