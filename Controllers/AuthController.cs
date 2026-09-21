using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AssignFlow.Data;
using AssignFlow.DTO.Auth;
using AssignFlow.Helper;

namespace AssignFlow.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JwtTokenGenerator _jwtTokenGenerator;

        public AuthController(
            ApplicationDbContext context,
            JwtTokenGenerator jwtTokenGenerator)
        {
            _context = context;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        // POST: api/Auth/login
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequestDto loginDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var user = await _context.Users
                .FirstOrDefaultAsync(x => x.Email == loginDto.Email);

            if (user == null)
                return Unauthorized(new
                {
                    Message = "Invalid email or password."
                });

            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(
                loginDto.Password,
                user.PasswordHash);

            if (!isPasswordValid)
                return Unauthorized(new
                {
                    Message = "Invalid email or password."
                });

            if (!user.IsActive)
                return BadRequest(new
                {
                    Message = "Your account is inactive."
                });

            var token = _jwtTokenGenerator.GenerateToken(user);

            return Ok(new
            {
                Message = "Login Successful",

                Token = token,

                User = new
                {
                    user.Id,
                    user.FullName,
                    user.Email,
                    Role = user.Role.ToString()
                }
            });
        }
    }
}
