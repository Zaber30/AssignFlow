using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnnorokomProjucti.Data;
using OnnorokomProjucti.DTO.Class;
using OnnorokomProjucti.Models.Entities;

namespace OnnorokomProjucti.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class ClassesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ClassesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/classes
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var classes = await _context.Classes
                .OrderBy(c => c.Name)
                .ToListAsync();

            return Ok(classes);
        }

        // GET: api/classes/{id}
        [HttpGet("{id:guid}")]
        public async Task<IActionResult> GetById(Guid id)
        {
            var classEntity = await _context.Classes.FindAsync(id);

            if (classEntity == null)
                return NotFound(new { Message = "Class not found." });

            return Ok(classEntity);
        }

        // POST: api/classes
        [HttpPost]
        public async Task<IActionResult> Create(CreateClassDto dto)
        {
            if (await _context.Classes.AnyAsync(c => c.Name == dto.Name))
            {
                return BadRequest(new
                {
                    Message = "Class already exists."
                });
            }

            var classEntity = new Class
            {
                Name = dto.Name
            };

            _context.Classes.Add(classEntity);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetById),
                new { id = classEntity.Id },
                classEntity);
        }

        // PUT: api/classes/{id}
        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateClassDto dto)
        {
            var classEntity = await _context.Classes.FindAsync(id);

            if (classEntity == null)
                return NotFound(new { Message = "Class not found." });

            if (await _context.Classes.AnyAsync(c => c.Name == dto.Name && c.Id != id))
            {
                return BadRequest(new
                {
                    Message = "Class already exists."
                });
            }

            classEntity.Name = dto.Name;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Class updated successfully."
            });
        }

        // DELETE: api/classes/{id}
        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var classEntity = await _context.Classes.FindAsync(id);

            if (classEntity == null)
                return NotFound(new { Message = "Class not found." });

            _context.Classes.Remove(classEntity);

            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = "Class deleted successfully."
            });
        }
    }
}
