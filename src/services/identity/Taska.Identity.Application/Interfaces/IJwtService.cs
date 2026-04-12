using Taska.Identity.Domain.Entities;

namespace Taska.Identity.Application.Interfaces;

public interface IJwtService
{
    string GenerateAccessToken(User user);
    string GenerateRefreshToken();
}