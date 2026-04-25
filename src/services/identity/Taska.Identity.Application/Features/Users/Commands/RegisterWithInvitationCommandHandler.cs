using Mediator;
using Microsoft.AspNetCore.Identity;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Enums;
using Taska.Shared.Exceptions;

namespace Taska.Identity.Application.Features.Users.Commands;

public class RegisterWithInvitationCommandHandler(IInvitationRepository invitationRepository, UserManager<User> userManager, IJwtService jwtService, IRefreshTokenRepository refreshTokenRepository) : IRequestHandler<RegisterWithInvitationCommand, RegisterResult>
{
    public async ValueTask<RegisterResult> Handle(RegisterWithInvitationCommand request, CancellationToken cancellationToken)
    {
        var invitation = await invitationRepository.GetByTokenAsync(request.Token, cancellationToken) ?? throw new ValidationException("Invalid invitation token.");

        if (DateTime.UtcNow > invitation.ExpiresAt)
            throw new ValidationException("Invitation token has expired.");

        if(invitation.IsAccepted)
            throw new ValidationException("Invitation token has already been accepted.");

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = invitation.Email,
            UserName = invitation.Email,
            CompanyId = invitation.CompanyId,
            CreatedAt = DateTime.UtcNow,
            SystemRole = SystemRole.Member
        };

        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new ValidationException(errors);
        }

        invitation.AcceptedAt = DateTime.UtcNow;
        await invitationRepository.UpdateAsync(invitation, cancellationToken);

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
