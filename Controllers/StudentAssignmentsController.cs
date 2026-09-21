
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AssignFlow.Data;
using AssignFlow.DTO.Assignment;
using AssignFlow.Models.Enums;

namespace AssignFlow.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Student")]
    public class StudentAssignmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public StudentAssignmentsController(
            ApplicationDbContext context)
        {
            _context = context;
        }


        // =====================================================
        // GET: api/StudentAssignments
        // Get all published assignments
        // =====================================================

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AssignmentDetailsDto>>>
            GetAssignments()
        {
            var assignments =
                await _context.Assignments

                    .Include(a => a.Teacher)
                    .Include(a => a.Class)
                    .Include(a => a.Subject)

                    .Where(a =>
                        a.Status ==
                        AssignmentStatus.Published)

                    .OrderBy(a => a.Deadline)

                    .Select(a =>
                        new AssignmentDetailsDto
                        {
                            Id = a.Id,

                            TeacherId =
                                a.TeacherId,

                            TeacherName =
                                a.Teacher.FullName,

                            ClassId =
                                a.ClassId,

                            ClassName =
                                a.Class.Name,

                            SubjectId =
                                a.SubjectId,

                            SubjectName =
                                a.Subject.Name,

                            Title =
                                a.Title,

                            Description =
                                a.Description,

                            Deadline =
                                a.Deadline,

                            MaxMarks =
                                a.MaxMarks,

                            Status =
                                a.Status,

                            CreatedAt =
                                a.CreatedAt,

                            UpdatedAt =
                                a.UpdatedAt
                        })

                    .ToListAsync();


            return Ok(assignments);
        }


        // =====================================================
        // GET: api/StudentAssignments/{id}
        // Get one published assignment
        // =====================================================

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<AssignmentDetailsDto>>
            GetAssignment(Guid id)
        {
            var assignment =
                await _context.Assignments

                    .Include(a => a.Teacher)
                    .Include(a => a.Class)
                    .Include(a => a.Subject)

                    .Where(a =>
                        a.Id == id
                        &&
                        a.Status ==
                        AssignmentStatus.Published)

                    .Select(a =>
                        new AssignmentDetailsDto
                        {
                            Id = a.Id,

                            TeacherId =
                                a.TeacherId,

                            TeacherName =
                                a.Teacher.FullName,

                            ClassId =
                                a.ClassId,

                            ClassName =
                                a.Class.Name,

                            SubjectId =
                                a.SubjectId,

                            SubjectName =
                                a.Subject.Name,

                            Title =
                                a.Title,

                            Description =
                                a.Description,

                            Deadline =
                                a.Deadline,

                            MaxMarks =
                                a.MaxMarks,

                            Status =
                                a.Status,

                            CreatedAt =
                                a.CreatedAt,

                            UpdatedAt =
                                a.UpdatedAt
                        })

                    .FirstOrDefaultAsync();


            if (assignment == null)
            {
                return NotFound(new
                {
                    Message =
                        "Assignment not found."
                });
            }


            return Ok(assignment);
        }
    }
}