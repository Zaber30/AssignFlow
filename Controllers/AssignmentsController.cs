using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using OnnorokomProjucti.Data;
using OnnorokomProjucti.DTO.Assignment;
using OnnorokomProjucti.Models.Entities;
using OnnorokomProjucti.Models.Enums;

namespace OnnorokomProjucti.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Teacher")]
    public class AssignmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AssignmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        //=========================================================
        // POST: api/Assignments
        //=========================================================

        [HttpPost]
        public async Task<IActionResult> CreateAssignment(CreateAssignmentDto dto)
        {
            // Get Teacher Id from JWT
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(teacherIdClaim))
            {
                return Unauthorized(new
                {
                    Message = "Invalid token."
                });
            }

            Guid teacherId = Guid.Parse(teacherIdClaim);

            // Check teacher exists
            var teacher = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == teacherId);

            if (teacher == null)
            {
                return Unauthorized(new
                {
                    Message = "Teacher not found."
                });
            }

            // Check class exists
            var classEntity = await _context.Classes
                .FindAsync(dto.ClassId);

            if (classEntity == null)
            {
                return NotFound(new
                {
                    Message = "Class not found."
                });
            }

            // Check subject exists
            var subject = await _context.Subjects
                .FindAsync(dto.SubjectId);

            if (subject == null)
            {
                return NotFound(new
                {
                    Message = "Subject not found."
                });
            }

            List<string> list = new List<string>();

            // Check teacher is assigned to this class & subject
            bool isAssigned = await _context.TeacherSubjects.AnyAsync(x =>
                x.TeacherId == teacherId &&
                x.ClassId == dto.ClassId &&
                x.SubjectId == dto.SubjectId);

            if (!isAssigned)
            {
                return Forbid();
            }

            var assignment = new Assignment
            {
                TeacherId = teacherId,
                ClassId = dto.ClassId,
                SubjectId = dto.SubjectId,
                Title = dto.Title,
                Description = dto.Description,
                Deadline = dto.Deadline,
                MaxMarks = dto.MaxMarks,
                Status = AssignmentStatus.Draft,
                CreatedAt = DateTime.UtcNow
            };

            _context.Assignments.Add(assignment);

            await _context.SaveChangesAsync();

            var response = new AssignmentDetailsDto
            {
                Id = assignment.Id,

                TeacherId = teacher.Id,
                TeacherName = teacher.FullName,

                ClassId = classEntity.Id,
                ClassName = classEntity.Name,

                SubjectId = subject.Id,
                SubjectName = subject.Name,

                Title = assignment.Title,
                Description = assignment.Description,
                Deadline = assignment.Deadline,
                MaxMarks = assignment.MaxMarks,
                Status = assignment.Status,

                CreatedAt = assignment.CreatedAt,
                UpdatedAt = assignment.UpdatedAt
            };

            return CreatedAtAction(nameof(GetAssignmentById),
                new { id = assignment.Id },
                response);
        }

        // This method will be implemented in Part 2
        // [NonAction]
        // public IActionResult GetAssignmentById(Guid id)
        // {
        //     throw new NotImplementedException();
        // }
        //


        //=========================================================
// GET: api/Assignments
//=========================================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssignmentDetailsDto>>> GetAllAssignments()
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(teacherIdClaim))
            {
                return Unauthorized(new
                {
                    Message = "Invalid token."
                });
            }

            Guid teacherId = Guid.Parse(teacherIdClaim);

            var assignments = await _context.Assignments
                .Include(a => a.Teacher)
                .Include(a => a.Class)
                .Include(a => a.Subject)
                .Where(a => a.TeacherId == teacherId)
                .OrderByDescending(a => a.CreatedAt)
                .Select(a => new AssignmentDetailsDto
                {
                    Id = a.Id,

                    TeacherId = a.TeacherId,
                    TeacherName = a.Teacher.FullName,

                    ClassId = a.ClassId,
                    ClassName = a.Class.Name,

                    SubjectId = a.SubjectId,
                    SubjectName = a.Subject.Name,

                    Title = a.Title,
                    Description = a.Description,

                    Deadline = a.Deadline,
                    MaxMarks = a.MaxMarks,

                    Status = a.Status,

                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt
                })
                .ToListAsync();

            return Ok(assignments);
        }

        //=========================================================
// GET: api/Assignments/{id}
//=========================================================

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<AssignmentDetailsDto>> GetAssignmentById(Guid id)
        {
            var teacherIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(teacherIdClaim))
            {
                return Unauthorized(new
                {
                    Message = "Invalid token."
                });
            }

            Guid teacherId = Guid.Parse(teacherIdClaim);

            var assignment = await _context.Assignments
                .Include(a => a.Teacher)
                .Include(a => a.Class)
                .Include(a => a.Subject)
                .Where(a => a.Id == id && a.TeacherId == teacherId)
                .Select(a => new AssignmentDetailsDto
                {
                    Id = a.Id,

                    TeacherId = a.TeacherId,
                    TeacherName = a.Teacher.FullName,

                    ClassId = a.ClassId,
                    ClassName = a.Class.Name,

                    SubjectId = a.SubjectId,
                    SubjectName = a.Subject.Name,

                    Title = a.Title,
                    Description = a.Description,

                    Deadline = a.Deadline,
                    MaxMarks = a.MaxMarks,

                    Status = a.Status,

                    CreatedAt = a.CreatedAt,
                    UpdatedAt = a.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (assignment == null)
            {
                return NotFound(new
                {
                    Message = "Assignment not found."
                });
            }

            return Ok(assignment);
        }

        // GET: api/Assignments/my-teaching
        [HttpGet("my-teaching")]
        public async Task<IActionResult> GetMyTeaching()
        {
            var teacherIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(teacherIdClaim))
            {
                return Unauthorized(new
                {
                    Message = "Invalid token."
                });
            }

            Guid teacherId = Guid.Parse(teacherIdClaim);

            var teaching = await _context.TeacherSubjects
                .Where(ts => ts.TeacherId == teacherId)
                .Select(ts => new
                {
                    Id = ts.Id,

                    ClassId = ts.ClassId,
                    ClassName = ts.Class.Name,

                    SubjectId = ts.SubjectId,
                    SubjectName = ts.Subject.Name,
                    SubjectCode = ts.Subject.Code
                })
                .OrderBy(x => x.ClassName)
                .ThenBy(x => x.SubjectName)
                .ToListAsync();

            return Ok(teaching);
        }


// =========================================================
// PUT: api/Assignments/{id}/publish
// Publish Assignment
// =========================================================

        [HttpPut("{id:guid}/publish")]
        public async Task<IActionResult> PublishAssignment(Guid id)
        {
            // Get logged-in teacher ID from JWT
            var teacherIdClaim =
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(teacherIdClaim))
            {
                return Unauthorized(new
                {
                    Message = "Invalid token."
                });
            }

            if (!Guid.TryParse(teacherIdClaim, out Guid teacherId))
            {
                return Unauthorized(new
                {
                    Message = "Invalid teacher ID."
                });
            }


            // Find assignment belonging to this teacher
            var assignment = await _context.Assignments
                .FirstOrDefaultAsync(a =>
                    a.Id == id &&
                    a.TeacherId == teacherId);


            if (assignment == null)
            {
                return NotFound(new
                {
                    Message = "Assignment not found."
                });
            }


            // Already published?
            if (assignment.Status == AssignmentStatus.Published)
            {
                return BadRequest(new
                {
                    Message = "Assignment is already published."
                });
            }


            // Publish
            assignment.Status =
                AssignmentStatus.Published;

            assignment.UpdatedAt =
                DateTime.UtcNow;


            await _context.SaveChangesAsync();


            return Ok(new
            {
                Message = "Assignment published successfully.",

                AssignmentId = assignment.Id,

                Status = assignment.Status
            });
        }
    }

}
