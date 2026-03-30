using MongoDB.Driver;

public class CourseService
{
    private readonly MongoContext _context;

    public CourseService(MongoContext context)
    {
        _context = context;
    }

    public async Task<List<Course>> GetAll()
        => await _context.Courses.Find(_ => true).ToListAsync();

    public async Task<Course?> GetById(string id)
        => await _context.Courses.Find(c => c.Id == id).FirstOrDefaultAsync();

    public async Task Create(Course course)
        => await _context.Courses.InsertOneAsync(course);

    public async Task Update(string id, Course updated)
        => await _context.Courses.ReplaceOneAsync(c => c.Id == id, updated);

    public async Task Delete(string id)
        => await _context.Courses.DeleteOneAsync(c => c.Id == id);
}