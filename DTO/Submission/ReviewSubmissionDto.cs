using AssignFlow.Models.Enums;

namespace AssignFlow.DTO.Submission;

public class ReviewSubmissionDto
{
    public int Marks { get; set; }

    public string? Feedback { get; set; }
}