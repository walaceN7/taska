using MassTransit;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Enums;
using Taska.Shared.Events;
using Taska.Shared.Exceptions;

namespace Taska.Identity.Application.Features.Users.Commands;

public class RemoveCompanyMemberCommandHandler(UserManager<User> userManager, ICurrentUser currentUser, IPublishEndpoint publishEndpoint) : IRequestHandler<RemoveCompanyMemberCommand>
{
    public async ValueTask<Unit> Handle(RemoveCompanyMemberCommand request, CancellationToken cancellationToken)
    {
        if (currentUser.SystemRole != SystemRole.CompanyAdmin && currentUser.SystemRole != SystemRole.SaasAdmin)
            throw new UnauthorizedException("Only administrators can remove members.");

        var targetUser = await userManager.FindByIdAsync(request.UserId.ToString())
            ?? throw new NotFoundException("User not found.");

        if (targetUser.CompanyId != currentUser.CompanyId)
            throw new UnauthorizedException("User does not belong to your company.");

        if (targetUser.Id == currentUser.UserId)
            throw new ValidationException("You cannot remove yourself from the company.");
                
        targetUser.CompanyId = null;
        targetUser.SystemRole = SystemRole.Member;

        await userManager.UpdateAsync(targetUser);
                
        await publishEndpoint.Publish(new CompanyMemberRemovedEvent(currentUser.CompanyId!.Value, targetUser.Id, DateTime.UtcNow), cancellationToken);

        return Unit.Value;
    }
}
