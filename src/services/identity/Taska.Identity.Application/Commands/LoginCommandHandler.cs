using MediatR;
using Microsoft.AspNetCore.Identity;
using Taska.Identity.Application.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;

namespace Taska.Identity.Application.Commands;

public class LoginCommandHandler(UserManager<User> userManager, IJwtService jwtService) : IRequestHandler<LoginCommand, LoginResult>
{
    private readonly UserManager<User> _userManager = userManager;
    private readonly IJwtService _jwtService = jwtService;

    public async Task<LoginResult> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);

        if (user == null || !await _userManager.CheckPasswordAsync(user, request.Password))
            throw new Exception("Invalid credentials");

        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        var accessToken = _jwtService.GenerateAccessToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        return new LoginResult(
            accessToken,
            refreshToken,
            DateTime.UtcNow.AddMinutes(15),
            new UserDto(
                user.Id,
                $"{user.FirstName} {user.LastName}",
                user.Email!,
                user.AvatarUrl,
                user.SystemRole.ToString(),
                user.CompanyId
            )
        );
    }
}