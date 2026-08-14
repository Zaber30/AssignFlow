using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
namespace OnnorokomProjucti.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Practice : ControllerBase
    {
        [HttpGet("index")]
        public IActionResult Index()
        {
            var hash = BCrypt.Net.BCrypt.HashPassword("Admin@123");

            return Ok(new
            {
                Password = "Admin@123",
                Hash = hash
            });
        }
    }
}
