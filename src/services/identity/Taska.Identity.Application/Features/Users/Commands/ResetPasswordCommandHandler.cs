using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Exceptions;

namespace Taska.Identity.Application.Features.Users.Commands;

public class ResetPasswordCommandHandler(UserManager<User> userManager) : IRequestHandler<ResetPasswordCommand>
{
    public async ValueTask<Unit> Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email) ?? throw new ValidationException("Invalid request.");
        var decodedTokenBytes = WebEncoders.Base64UrlDecode(request.Token);
        var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);

        var result = await userManager.ResetPasswordAsync(user, decodedToken, request.NewPassword);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new ValidationException($"Failed to reset password: {errors}");
        }

        return Unit.Value;
    }
}
