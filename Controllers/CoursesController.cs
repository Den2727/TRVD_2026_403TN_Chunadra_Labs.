using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

[Authorize] // всі методи за замовчуванням захищені
[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly CourseService _service;

    public CoursesController(CourseService service)
    {
        _service = service;
    }

    // PUBLIC (доступний без токена)
    [AllowAnonymous]
    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var courses = await _service.GetAll();

        var result = courses.Select(c => new CourseDto
        {
            Title = c.Title,
            Description = c.Description
        });

        return Ok(result);
    }

    // GET by ID (потрібен токен)
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(string id)
    {
        var course = await _service.GetById(id);

        if (course == null)
            return NotFound();

        var dto = new CourseDto
        {
            Title = course.Title,
            Description = course.Description
        };

        return Ok(dto);
    }

    // CREATE (потрібен токен)
    [HttpPost]
    public async Task<IActionResult> Create(CourseDto dto)
    {
        var course = new Course
        {
            Title = dto.Title,
            Description = dto.Description
        };

        await _service.Create(course);

        return StatusCode(201);
    }

    // UPDATE (потрібен токен)
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, CourseDto dto)
    {
        var existing = await _service.GetById(id);

        if (existing == null)
            return NotFound();

        existing.Title = dto.Title;
        existing.Description = dto.Description;

        await _service.Update(id, existing);

        return Ok();
    }

    // ADMIN ONLY
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var existing = await _service.GetById(id);

        if (existing == null)
            return NotFound();

        await _service.Delete(id);

        return Ok();
    }
}