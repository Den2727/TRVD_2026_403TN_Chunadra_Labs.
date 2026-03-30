using MongoDB.Driver;

public class MongoContext
{
    private readonly IMongoDatabase _database;

    public MongoContext(IConfiguration config)
    {
        var client = new MongoClient(config.GetConnectionString("MongoDB"));
        _database = client.GetDatabase("EducationDb");
    }

    public IMongoCollection<Course> Courses =>
        _database.GetCollection<Course>("Courses");

    public IMongoCollection<User> Users =>
        _database.GetCollection<User>("Users");
}