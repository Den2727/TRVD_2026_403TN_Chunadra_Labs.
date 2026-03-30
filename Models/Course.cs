using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

public class Course
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; }

    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}