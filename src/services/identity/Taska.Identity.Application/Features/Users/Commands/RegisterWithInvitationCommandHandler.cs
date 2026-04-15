using Mediator;
using Microsoft.AspNetCore.Identity;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Identity.Domain.Exceptions;

namespace Taska.Identity.Application.Features.Users.Commands;

public class RegisterWithInvitationCommandHandler(IInvitationRepository invitationRepository, UserManager<User> userManager) : IRequestHandler<RegisterWithInvitationCommand, RegisterResult>
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
            SystemRole = Domain.Enums.SystemRole.Member
        };

        var result = await userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new ValidationException(errors);
        }

        invitation.AcceptedAt = DateTime.UtcNow;
        await invitationRepository.UpdateAsync(invitation, cancellationToken);

        return new RegisterResult(user.Id, user.Email!, $"{user.FirstName} {user.LastName}");
    }
}
