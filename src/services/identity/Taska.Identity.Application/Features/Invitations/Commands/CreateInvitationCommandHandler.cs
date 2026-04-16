using Mapster;
using Mediator;
using Taska.Identity.Application.Features.Invitations.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Identity.Domain.Exceptions;
using Taska.Shared.Enums;

namespace Taska.Identity.Application.Features.Invitations.Commands;

public class CreateInvitationCommandHandler(IInvitationRepository invitationRepository, ICurrentUser currentUser, IEmailService emailService) : IRequestHandler<CreateInvitationCommand, InvitationResult>
{
    public async ValueTask<InvitationResult> Handle(CreateInvitationCommand request, CancellationToken cancellationToken)
    {
        if (currentUser.SystemRole != SystemRole.SaasAdmin && currentUser.SystemRole != SystemRole.CompanyAdmin)
            throw new UnauthorizedException("Only admins can invite new members");
                
        if (!currentUser.CompanyId.HasValue)
            throw new ValidationException("Admin must belong to a company to invite users");

        var hasPendingInvitation = await invitationRepository.HasPendingInvitationAsync(request.Email, currentUser.CompanyId.Value, cancellationToken);
        if (hasPendingInvitation)
            throw new ValidationException("A pending invitation for this email already exists");
                
        var token = Guid.NewGuid().ToString("N");

        var invitation = new Invitation
        {
            Email = request.Email,
            CompanyId = currentUser.CompanyId.Value,
            Token = token,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            InvitedBy = currentUser.UserId
        };

        var created = await invitationRepository.AddAsync(invitation, cancellationToken);

        await emailService.SendInvitationEmailAsync(created.Email, created.Token, cancellationToken);

        return created.Adapt<InvitationResult>();
    }
}