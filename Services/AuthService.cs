using MongoDB.Driver;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Text;

public class AuthService
{
    private readonly MongoContext _context;
    private readonly IConfiguration _config;

    public AuthService(MongoContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
    }

    public async Task Register(AuthDto dto)
    {
        var hash = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var user = new User
        {
            Email = dto.Email,
            PasswordHash = hash,
            Role = "User"
        };

        await _context.Users.InsertOneAsync(user);
    }

    public async Task<string?> Login(AuthDto dto)
    {
        var user = await _context.Users
            .Find(u => u.Email == dto.Email)
            .FirstOrDefaultAsync();

        if (user == null)
            return null;

        bool isValid = BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash);

        if (!isValid)
            return null;

        return GenerateJwt(user);
    }

    private string GenerateJwt(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"])
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id!),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role)
        };

        var token = new JwtSecurityToken(
            expires: DateTime.Now.AddMinutes(30),
            claims: claims,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}