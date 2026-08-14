using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using OnnorokomProjucti.Data;
using OnnorokomProjucti.DTO.StudentClass;
using OnnorokomProjucti.Models.Entities;
using OnnorokomProjucti.Models.Enums;

namespace OnnorokomProjucti.Controllers
{ 
    [ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class StudentClassesController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public StudentClassesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/StudentClasses
    [HttpGet]
    public async Task<ActionResult<IEnumerable<StudentClassResponseDto>>> GetAll()
    {
        var result = await _context.StudentClasses
            .Include(x => x.Student)
            .Include(x => x.Class)
            .Select(x => new StudentClassResponseDto
            {
                Id = x.Id,
                StudentId = x.StudentId,
                StudentName = x.Student.FullName,
                ClassId = x.ClassId,
                ClassName = x.Class.Name,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .ToListAsync();

        return Ok(result);
    }

    // GET: api/StudentClasses/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<StudentClassResponseDto>> GetById(Guid id)
    {
        var result = await _context.StudentClasses
            .Include(x => x.Student)
            .Include(x => x.Class)
            .Where(x => x.Id == id)
            .Select(x => new StudentClassResponseDto
            {
                Id = x.Id,
                StudentId = x.StudentId,
                StudentName = x.Student.FullName,
                ClassId = x.ClassId,
                ClassName = x.Class.Name,
                CreatedAt = x.CreatedAt,
                UpdatedAt = x.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (result == null)
            return NotFound(new { Message = "Student assignment not found." });

        return Ok(result);
    }

    // POST: api/StudentClasses
    [HttpPost]
    public async Task<IActionResult> AssignStudent(AssignStudentClassDto dto)
    {
        var student = await _context.Users.FindAsync(dto.StudentId);

        if (student == null)
            return NotFound(new { Message = "Student not found." });

        if (student.Role != UserRole.Student)
            return BadRequest(new { Message = "Selected user is not a student." });

        var classEntity = await _context.Classes.FindAsync(dto.ClassId);

        if (classEntity == null)
            return NotFound(new { Message = "Class not found." });

        bool exists = await _context.StudentClasses
            .AnyAsync(x => x.StudentId == dto.StudentId);

        if (exists)
            return BadRequest(new
            {
                Message = "Student is already assigned to a class."
            });

        var studentClass = new StudentClass
        {
            StudentId = dto.StudentId,
            ClassId = dto.ClassId
        };

        _context.StudentClasses.Add(studentClass);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            Message = "Student assigned successfully."
        });
    }

    // PUT: api/StudentClasses/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, AssignStudentClassDto dto)
    {
        var studentClass = await _context.StudentClasses.FindAsync(id);

        if (studentClass == null)
            return NotFound(new { Message = "Assignment not found." });

        studentClass.StudentId = dto.StudentId;
        studentClass.ClassId = dto.ClassId;
        studentClass.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            Message = "Student class updated successfully."
        });
    }

    // DELETE: api/StudentClasses/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var studentClass = await _context.StudentClasses.FindAsync(id);

        if (studentClass == null)
            return NotFound(new { Message = "Assignment not found." });

        _context.StudentClasses.Remove(studentClass);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            Message = "Student removed from class successfully."
        });
    }
}
}
