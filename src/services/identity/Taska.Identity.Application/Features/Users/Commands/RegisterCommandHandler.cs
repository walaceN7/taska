using MassTransit;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Enums;
using Taska.Shared.Events;
using Taska.Shared.Exceptions;

namespace Taska.Identity.Application.Features.Users.Commands;

public class RegisterCommandHandler(UserManager<User> userManager, IPublishEndpoint publishEndpoint, IJwtService jwtService, IRefreshTokenRepository refreshTokenRepository, ITurnstileService turnstileService) : IRequestHandler<RegisterCommand, RegisterResult>
{
    public async ValueTask<RegisterResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var isHuman = await turnstileService.VerifyTokenAsync(request.TurnstileToken, cancellationToken);
        if (!isHuman)
            throw new UnauthorizedException("Security verification failed (Bot detected).");

        if (!Enum.IsDefined(typeof(CompanyPlan), request.PlanId))
        {
            throw new ValidationException("The selected plan is invalid.");
        }

        var companyPlan = (CompanyPlan)request.PlanId;

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            UserName = request.Email,
            CompanyId = null,
            CreatedAt = DateTime.UtcNow,
            SystemRole = SystemRole.CompanyAdmin
        };

        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new ValidationException(errors);
        }

        await publishEndpoint.Publish(new UserRegisteredEvent(
            user.Id,
            request.CompanyName,
            companyPlan
        ), cancellationToken);

        var accessToken = jwtService.GenerateAccessToken(user);
        var refreshToken = jwtService.GenerateRefreshToken();
        var refreshTokenExpiryDate = DateTime.UtcNow.AddDays(7);

        await refreshTokenRepository.AddAsync(new RefreshToken
        {
            Id = Guid.NewGuid(),
            Token = refreshToken,
            UserId = user.Id,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = refreshTokenExpiryDate,
            IsRevoked = false
        }, cancellationToken);

        return new RegisterResult(
            accessToken,
            refreshToken,
            refreshTokenExpiryDate,
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