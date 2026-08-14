using OnnorokomProjucti.Models.Enums;

namespace OnnorokomProjucti.DTO.User;

public class UpdateUserDto
{
    public string FullName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public UserRole Role { get; set; }

    public bool IsActive { get; set; }
}