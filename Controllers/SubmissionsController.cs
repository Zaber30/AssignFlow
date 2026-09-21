using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using AssignFlow.Data;
using AssignFlow.DTO.Submission;
using AssignFlow.Models.Entities;
using AssignFlow.Models.Enums;

namespace AssignFlow.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubmissionsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubmissionsController(
            ApplicationDbContext context)
        {
            _context = context;
        }

        // =====================================================
        // STUDENT SUBMIT ASSIGNMENT
        //
        // POST: api/Submissions
        // =====================================================

        [Authorize(Roles = "Student")]
        [HttpPost]
        public async Task<IActionResult> Submit(
            CreateSubmissionDto dto)
        {
            // -------------------------------------------------
            // Get student ID from JWT
            // -------------------------------------------------

            var studentIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(studentIdClaim))
            {
                return Unauthorized(new
                {
                    Message = "Invalid token."
                });
            }

            if (!Guid.TryParse(
                    studentIdClaim,
                    out Guid studentId))
            {
                return Unauthorized(new
                {
                    Message = "Invalid student ID."
                });
            }

            // -------------------------------------------------
            // Check assignment
            // -------------------------------------------------

            var assignment =
                await _context.Assignments
                    .FirstOrDefaultAsync(x =>
                        x.Id == dto.AssignmentId &&
                        x.Status == AssignmentStatus.Published);

            if (assignment == null)
            {
                return NotFound(new
                {
                    Message =
                        "Published assignment not found."
                });
            }

            // -------------------------------------------------
            // Check deadline
            // -------------------------------------------------

            if (DateTime.UtcNow > assignment.Deadline)
            {
                return BadRequest(new
                {
                    Message =
                        "Assignment deadline has passed."
                });
            }

            // -------------------------------------------------
            // Check duplicate submission
            // -------------------------------------------------

            bool alreadySubmitted =
                await _context.Submissions
                    .AnyAsync(x =>
                        x.AssignmentId == dto.AssignmentId &&
                        x.StudentId == studentId);

            if (alreadySubmitted)
            {
                return BadRequest(new
                {
                    Message =
                        "Assignment already submitted."
                });
            }

            // -------------------------------------------------
            // Create submission
            // -------------------------------------------------

            var submission =
                new Submission
                {
                    AssignmentId =
                        dto.AssignmentId,

                    StudentId =
                        studentId,

                    Answer =
                        dto.Answer,

                    AttachmentUrl =
                        dto.AttachmentUrl,

                    SubmittedAt =
                        DateTime.UtcNow,

                    Status =
                        SubmissionStatus.Submitted,

                    CreatedAt =
                        DateTime.UtcNow
                };

            _context.Submissions.Add(submission);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message =
                    "Assignment submitted successfully.",

                SubmissionId =
                    submission.Id
            });
        }

        // =====================================================
        // GET ALL SUBMISSIONS
        //
        // Student -> own submissions
        // Teacher -> submissions for own assignments
        //
        // GET: api/Submissions
        // =====================================================

        [Authorize(Roles = "Teacher,Student")]
        [HttpGet]
        public async Task<IActionResult> GetAllSubmissions()
        {
            // -------------------------------------------------
            // Get user ID from JWT
            // -------------------------------------------------

            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    Message = "Invalid token."
                });
            }

            if (!Guid.TryParse(
                    userIdClaim,
                    out Guid userId))
            {
                return Unauthorized(new
                {
                    Message = "Invalid user ID."
                });
            }

            // -------------------------------------------------
            // Get role from JWT
            // -------------------------------------------------

            var role =
                User.FindFirst(
                    ClaimTypes.Role)?.Value;

            // =================================================
            // STUDENT
            // =================================================

            if (role == "Student")
            {
                var submissions =
                    await _context.Submissions
                        .Include(x => x.Assignment)
                        .Include(x => x.Student)

                        .Where(x =>
                            x.StudentId == userId)

                        .OrderByDescending(x => x.SubmittedAt)

                        .Select(x =>
                            new SubmissionResponseDto
                            {
                                Id =
                                    x.Id,

                                AssignmentId =
                                    x.AssignmentId,

                                AssignmentTitle =
                                    x.Assignment.Title,

                                StudentId =
                                    x.StudentId,

                                StudentName =
                                    x.Student.FullName,

                                SubmittedAt =
                                    x.SubmittedAt,

                                Marks =
                                    x.Marks,

                                Status =
                                    x.Status
                            })

                        .ToListAsync();

                return Ok(submissions);
            }

            // =================================================
            // TEACHER
            // =================================================

            if (role == "Teacher")
            {
                var submissions =
                    await _context.Submissions
                        .Include(x => x.Assignment)
                        .Include(x => x.Student)

                        .Where(x =>
                            x.Assignment.TeacherId == userId)

                        .OrderByDescending(x => x.SubmittedAt)

                        .Select(x =>
                            new SubmissionResponseDto
                            {
                                Id =
                                    x.Id,

                                AssignmentId =
                                    x.AssignmentId,

                                AssignmentTitle =
                                    x.Assignment.Title,

                                StudentId =
                                    x.StudentId,

                                StudentName =
                                    x.Student.FullName,

                                SubmittedAt =
                                    x.SubmittedAt,

                                Marks =
                                    x.Marks,

                                Status =
                                    x.Status
                            })

                        .ToListAsync();

                return Ok(submissions);
            }

            return Forbid();
        }

        // =====================================================
        // GET SUBMISSION BY ID
        //
        // Student -> only own submission
        // Teacher -> only submissions for own assignments
        //
        // GET: api/Submissions/{id}
        // =====================================================

        [Authorize(Roles = "Teacher,Student")]
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetSubmissionById(
            Guid id)
        {
            // -------------------------------------------------
            // Get user ID from JWT
            // -------------------------------------------------

            var userIdClaim =
                User.FindFirst(
                    ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                return Unauthorized(new
                {
                    Message = "Invalid token."
                });
            }

            if (!Guid.TryParse(
                    userIdClaim,
                    out Guid userId))
            {
                return Unauthorized(new
                {
                    Message = "Invalid user ID."
                });
            }

            // -------------------------------------------------
            // Get role from JWT
            // -------------------------------------------------

            var role =
                User.FindFirst(
                    ClaimTypes.Role)?.Value;

            // -------------------------------------------------
            // Find submission
            // -------------------------------------------------

            var submission =
                await _context.Submissions
                    .Include(x => x.Assignment)
                    .Include(x => x.Student)
                    .FirstOrDefaultAsync(x => x.Id == id);

            if (submission == null)
            {
                return NotFound(new
                {
                    Message =
                        "Submission not found."
                });
            }

            // -------------------------------------------------
            // Student can only see own submission
            // -------------------------------------------------

            if (role == "Student" &&
                submission.StudentId != userId)
            {
                return Forbid();
            }

            // -------------------------------------------------
            // Teacher can only see submissions
            // for their own assignments
            // -------------------------------------------------

            if (role == "Teacher" &&
                submission.Assignment.TeacherId != userId)
            {
                return Forbid();
            }

            // -------------------------------------------------
            // Return submission details
            // -------------------------------------------------

            var response =
                new SubmissionDetailsDto
                {
                    Id =
                        submission.Id,

                    AssignmentId =
                        submission.AssignmentId,

                    AssignmentTitle =
                        submission.Assignment.Title,

                    StudentId =
                        submission.StudentId,

                    StudentName =
                        submission.Student.FullName,

                    Answer =
                        submission.Answer,

                    AttachmentUrl =
                        submission.AttachmentUrl,

                    SubmittedAt =
                        submission.SubmittedAt,

                    Marks =
                        submission.Marks,

                    Feedback =
                        submission.Feedback,

                    Status =
                        submission.Status,

                    CreatedAt =
                        submission.CreatedAt,

                    UpdatedAt =
                        submission.UpdatedAt
                };

            return Ok(response);
        }
        // =====================================================
// Teacher: Get submissions for one assignment
// GET: api/Submissions/assignment/{assignmentId}
// =====================================================

        [HttpGet("assignment/{assignmentId:guid}")]
        [Authorize(Roles = "Teacher")]
        public async Task<IActionResult> GetAssignmentSubmissions(
            Guid assignmentId)
        {
            // Get logged-in teacher ID
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


            // Find assignment
            var assignment =
                await _context.Assignments
                    .FirstOrDefaultAsync(a =>
                        a.Id == assignmentId);

            if (assignment == null)
            {
                return NotFound(new
                {
                    Message = "Assignment not found."
                });
            }


            // Make sure this assignment belongs to
            // the logged-in teacher
            if (assignment.TeacherId != teacherId)
            {
                return Forbid();
            }


            // Get submissions
            var submissions =
                await _context.Submissions

                    .Include(s => s.Assignment)

                    .Include(s => s.Student)

                    .Where(s =>
                        s.AssignmentId == assignmentId)

                    .OrderByDescending(s => s.SubmittedAt)

                    .Select(s => new SubmissionDetailsDto
                    {
                        Id = s.Id,

                        AssignmentId =
                            s.AssignmentId,

                        AssignmentTitle =
                            s.Assignment.Title,

                        StudentId =
                            s.StudentId,

                        StudentName =
                            s.Student.FullName,

                        Answer =
                            s.Answer,

                        AttachmentUrl =
                            s.AttachmentUrl,

                        SubmittedAt =
                            s.SubmittedAt,

                        Marks =
                            s.Marks,

                        Feedback =
                            s.Feedback,

                        Status =
                            s.Status,

                        CreatedAt =
                            s.CreatedAt,

                        UpdatedAt =
                            s.UpdatedAt
                    })

                    .ToListAsync();


            return Ok(submissions);
        }
    }
}