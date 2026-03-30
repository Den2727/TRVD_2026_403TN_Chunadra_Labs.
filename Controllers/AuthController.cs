using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _service;

    public AuthController(AuthService service)
    {
        _service = service;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(AuthDto dto)
    {
        await _service.Register(dto);
        return Ok("User created");
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(AuthDto dto)
    {
        var token = await _service.Login(dto);

        if (token == null)
            return Unauthorized();

        return Ok(new { token });
    }
}