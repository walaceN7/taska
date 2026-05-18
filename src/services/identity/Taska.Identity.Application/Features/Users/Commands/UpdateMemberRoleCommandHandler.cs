using Mediator;
using Microsoft.AspNetCore.Identity;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Enums;
using Taska.Shared.Exceptions;

namespace Taska.Identity.Application.Features.Users.Commands;

public class UpdateMemberRoleCommandHandler(UserManager<User> userManager, ICurrentUser currentUser) : IRequestHandler<UpdateMemberRoleCommand>
{
    public async ValueTask<Unit> Handle(UpdateMemberRoleCommand request, CancellationToken cancellationToken)
    {        
        if (currentUser.SystemRole != SystemRole.CompanyAdmin && currentUser.SystemRole != SystemRole.SaasAdmin)
            throw new UnauthorizedException("Only administrators can change member roles.");

        var targetUser = await userManager.FindByIdAsync(request.UserId.ToString())
            ?? throw new NotFoundException("User not found.");
                
        if (targetUser.CompanyId != currentUser.CompanyId)
            throw new UnauthorizedException("User does not belong to your company.");
                
        if (targetUser.Id == currentUser.UserId)
            throw new ValidationException("You cannot change your own role here.");

        if (request.Role != SystemRole.CompanyAdmin && request.Role != SystemRole.Member)
            throw new ValidationException("Invalid role selected.");

        targetUser.SystemRole = request.Role;
        await userManager.UpdateAsync(targetUser);

        return Unit.Value;
    }
}
