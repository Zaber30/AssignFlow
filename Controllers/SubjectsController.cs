using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using AssignFlow.Data;
using AssignFlow.DTO.Subject;
using AssignFlow.Models.Entities;

namespace AssignFlow.Controllers
{
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

    public SubjectsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Subjects
    [HttpGet]
    public async Task<ActionResult<IEnumerable<SubjectResponseDto>>> GetAllSubjects()
    {
        var subjects = await _context.Subjects
            .OrderBy(s => s.Name)
            .Select(s => new SubjectResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                Code = s.Code,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            })
            .ToListAsync();

        return Ok(subjects);
    }

    // GET: api/Subjects/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<SubjectResponseDto>> GetSubjectById(Guid id)
    {
        var subject = await _context.Subjects
            .Where(s => s.Id == id)
            .Select(s => new SubjectResponseDto
            {
                Id = s.Id,
                Name = s.Name,
                Code = s.Code,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt
            })
            .FirstOrDefaultAsync();

        if (subject == null)
        {
            return NotFound(new
            {
                Message = "Subject not found."
            });
        }

        return Ok(subject);
    }

    // POST: api/Subjects
    [HttpPost]
    public async Task<IActionResult> CreateSubject(CreateSubjectDto dto)
    {
        if (await _context.Subjects.AnyAsync(s => s.Code == dto.Code))
        {
            return BadRequest(new
            {
                Message = "Subject code already exists."
            });
        }

        var subject = new Subject
        {
            Name = dto.Name,
            Code = dto.Code
        };

        _context.Subjects.Add(subject);

        await _context.SaveChangesAsync();

        var response = new SubjectResponseDto
        {
            Id = subject.Id,
            Name = subject.Name,
            Code = subject.Code,
            CreatedAt = subject.CreatedAt,
            UpdatedAt = subject.UpdatedAt
        };

        return CreatedAtAction(nameof(GetSubjectById),
            new { id = subject.Id },
            response);
    }

    // PUT: api/Subjects/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> UpdateSubject(Guid id, UpdateSubjectDto dto)
    {
        var subject = await _context.Subjects.FindAsync(id);

        if (subject == null)
        {
            return NotFound(new
            {
                Message = "Subject not found."
            });
        }

        bool codeExists = await _context.Subjects
            .AnyAsync(s => s.Code == dto.Code && s.Id != id);

        if (codeExists)
        {
            return BadRequest(new
            {
                Message = "Subject code already exists."
            });
        }

        subject.Name = dto.Name;
        subject.Code = dto.Code;
        subject.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            Message = "Subject updated successfully."
        });
    }

    // DELETE: api/Subjects/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteSubject(Guid id)
    {
        var subject = await _context.Subjects.FindAsync(id);

        if (subject == null)
        {
            return NotFound(new
            {
                Message = "Subject not found."
            });
        }

        _context.Subjects.Remove(subject);

        await _context.SaveChangesAsync();

        return Ok(new
        {
            Message = "Subject deleted successfully."
        });
    }
    }
}
