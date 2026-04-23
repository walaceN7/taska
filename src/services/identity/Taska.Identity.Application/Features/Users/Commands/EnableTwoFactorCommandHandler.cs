using Mediator;
using Microsoft.AspNetCore.Identity;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Exceptions;

namespace Taska.Identity.Application.Features.Users.Commands;

public class EnableTwoFactorCommandHandler(UserManager<User> userManager, ICurrentUser currentUser) : IRequestHandler<EnableTwoFactorCommand>
{
    public async ValueTask<Unit> Handle(EnableTwoFactorCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(currentUser.UserId.ToString())
            ?? throw new NotFoundException("User not found.");
                
        var isCodeValid = await userManager.VerifyTwoFactorTokenAsync(user, userManager.Options.Tokens.AuthenticatorTokenProvider, request.Code);

        if (!isCodeValid)
            throw new ValidationException("Invalid authentication code.");
                
        await userManager.SetTwoFactorEnabledAsync(user, true);

        return Unit.Value;
    }
}
