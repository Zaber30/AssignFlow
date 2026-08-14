using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using OnnorokomProjucti.Data;
using OnnorokomProjucti.DTO.TeacherSubject;
using OnnorokomProjucti.Models.Entities;
using OnnorokomProjucti.Models.Enums;

namespace OnnorokomProjucti.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class TeacherSubjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeacherSubjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        //=========================================================
        // Assign Teacher to Class & Subject
        // POST: api/TeacherSubjects
        //=========================================================

        [HttpPost]
        public async Task<IActionResult> AssignTeacherSubject(AssignTeacherSubjectDto dto)
        {
            // Check Teacher
            var teacher = await _context.Users
                .FirstOrDefaultAsync(x => x.Id == dto.TeacherId);

            if (teacher == null)
            {
                return NotFound(new
                {
                    Message = "Teacher not found."
                });
            }

            if (teacher.Role != UserRole.Teacher)
            {
                return BadRequest(new
                {
                    Message = "Selected user is not a Teacher."
                });
            }

            // Check Class

            var classEntity = await _context.Classes
                .FindAsync(dto.ClassId);

            if (classEntity == null)
            {
                return NotFound(new
                {
                    Message = "Class not found."
                });
            }

            // Check Subject

            var subject = await _context.Subjects
                .FindAsync(dto.SubjectId);

            if (subject == null)
            {
                return NotFound(new
                {
                    Message = "Subject not found."
                });
            }

            // Prevent duplicate assignment

            bool exists = await _context.TeacherSubjects.AnyAsync(x =>
                x.TeacherId == dto.TeacherId &&
                x.ClassId == dto.ClassId &&
                x.SubjectId == dto.SubjectId);

            if (exists)
            {
                return BadRequest(new
                {
                    Message = "Teacher is already assigned to this Class and Subject."
                });
            }

            var teacherSubject = new TeacherSubject
            {
                TeacherId = dto.TeacherId,
                ClassId = dto.ClassId,
                SubjectId = dto.SubjectId,
                CreatedAt = DateTime.UtcNow
            };

            _context.TeacherSubjects.Add(teacherSubject);

            await _context.SaveChangesAsync();

            var response = new TeacherSubjectResponseDto
            {
                Id = teacherSubject.Id,

                TeacherId = teacher.Id,
                TeacherName = teacher.FullName,

                ClassId = classEntity.Id,
                ClassName = classEntity.Name,

                SubjectId = subject.Id,
                SubjectName = subject.Name,

                CreatedAt = teacherSubject.CreatedAt,
                UpdatedAt = teacherSubject.UpdatedAt
            };

            return Ok(response);
        }


        //=========================================================
// GET: api/TeacherSubjects
//=========================================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<TeacherSubjectResponseDto>>> GetAll()
        {
            var teacherSubjects = await _context.TeacherSubjects
                .Include(ts => ts.Teacher)
                .Include(ts => ts.Class)
                .Include(ts => ts.Subject)
                .OrderBy(ts => ts.Teacher.FullName)
                .Select(ts => new TeacherSubjectResponseDto
                {
                    Id = ts.Id,

                    TeacherId = ts.TeacherId,
                    TeacherName = ts.Teacher.FullName,

                    ClassId = ts.ClassId,
                    ClassName = ts.Class.Name,

                    SubjectId = ts.SubjectId,
                    SubjectName = ts.Subject.Name,

                    CreatedAt = ts.CreatedAt,
                    UpdatedAt = ts.UpdatedAt
                })
                .ToListAsync();

            return Ok(teacherSubjects);
        }

        // /=========================================================
// GET: api/TeacherSubjects/{id}
//=========================================================

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<TeacherSubjectResponseDto>> GetById(Guid id)
        {
            var teacherSubject = await _context.TeacherSubjects
                .Include(ts => ts.Teacher)
                .Include(ts => ts.Class)
                .Include(ts => ts.Subject)
                .Where(ts => ts.Id == id)
                .Select(ts => new TeacherSubjectResponseDto
                {
                    Id = ts.Id,

                    TeacherId = ts.TeacherId,
                    TeacherName = ts.Teacher.FullName,

                    ClassId = ts.ClassId,
                    ClassName = ts.Class.Name,

                    SubjectId = ts.SubjectId,
                    SubjectName = ts.Subject.Name,

                    CreatedAt = ts.CreatedAt,
                    UpdatedAt = ts.UpdatedAt
                })
                .FirstOrDefaultAsync();

            if (teacherSubject == null)
            {
                return NotFound(new
                {
                    Message = "Teacher subject assignment not found."
                });
            }

            return Ok(teacherSubject);
        }

        //=========================================================
// PUT: api/TeacherSubjects/{id}
//=========================================================

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, AssignTeacherSubjectDto dto)
        {
            var teacherSubject = await _context.TeacherSubjects
                .FindAsync(id);

            if (teacherSubject == null)
            {
                return NotFound(new
                {
                    Message = "Teacher subject assignment not found."
                });
            }

            var teacher = await _context.Users.FindAsync(dto.TeacherId);

            if (teacher == null)
            {
                return NotFound(new
                {
                    Message = "Teacher not found."
                });
            }

            if (teacher.Role != UserRole.Teacher)
            {
                return BadRequest(new
                {
                    Message = "Selected user is not a teacher."
                });
            }

            if (!await _context.Classes.AnyAsync(c => c.Id == dto.ClassId))
            {
                return NotFound(new
                {
                    Message = "Class not found."
                });
            }

            if (!await _context.Subjects.AnyAsync(s => s.Id == dto.SubjectId))
            {
                return NotFound(new
                {
                    Message = "Subject not found."
                });
            }

            bool duplicate = await _context.TeacherSubjects.AnyAsync(ts =>
                ts.TeacherId == dto.TeacherId &&
                ts.ClassId == dto.ClassId &&
                ts.SubjectId == dto.SubjectId &&
                ts.Id != id);

            if (duplicate)
            {
                return BadRequest(new
                {
                    Message = "This assignment already exists."
                });
            }

            teacherSubject.TeacherId = dto.TeacherId;
            teacherSubject.ClassId = dto.ClassId;
            teacherSubject.SubjectId = dto.SubjectId;
            teacherSubject.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Teacher assignment updated successfully."
            });
        }
        //=========================================================
// DELETE: api/TeacherSubjects/{id}
//=========================================================

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var teacherSubject = await _context.TeacherSubjects
                .Include(ts => ts.Subject)
                .FirstOrDefaultAsync(ts => ts.Id == id);

            if (teacherSubject == null)
            {
                return NotFound(new
                {
                    Message = "Teacher assignment not found."
                });
            }

            bool hasAssignments = await _context.Assignments.AnyAsync(a =>
                a.TeacherId == teacherSubject.TeacherId &&
                a.ClassId == teacherSubject.ClassId &&
                a.SubjectId == teacherSubject.SubjectId);

            if (hasAssignments)
            {
                return BadRequest(new
                {
                    Message = "Cannot delete. Teacher has already created assignments for this class and subject."
                });
            }

            _context.TeacherSubjects.Remove(teacherSubject);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Teacher assignment deleted successfully."
            });
        }
    }
}
