namespace OnnorokomProjucti.Models.Entities;

public class StudentClass: BaseEntity
{
    public Guid StudentId { get; set; }

    public Guid ClassId { get; set; }

    // Navigation

    public User Student { get; set; } = null!;

    public Class Class { get; set; } = null!;
}