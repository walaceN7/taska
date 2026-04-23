using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.WebUtilities;
using System.Text;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;

namespace Taska.Identity.Application.Features.Users.Commands;

public class ForgotPasswordCommandHandler(UserManager<User> userManager, IEmailService emailService) : IRequestHandler<ForgotPasswordCommand>
{
    public async ValueTask<Unit> Handle(ForgotPasswordCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByEmailAsync(request.Email);

        if (user == null) return Unit.Value;

        var token = await userManager.GeneratePasswordResetTokenAsync(user);

        var encodedToken = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

        var resetUrl = $"http://localhost:3000/reset-password?token={encodedToken}&email={request.Email}";

        await emailService.SendPasswordResetEmailAsync(user.Email!, resetUrl, cancellationToken);

        return Unit.Value;
    }
}
