using Mediator;
using Microsoft.AspNetCore.Identity;
using System.Text.Encodings.Web;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Exceptions;

namespace Taska.Identity.Application.Features.Users.Commands;

public class SetupTwoFactorCommandHandler(UserManager<User> userManager, ICurrentUser currentUser, UrlEncoder urlEncoder) : IRequestHandler<SetupTwoFactorCommand, SetupTwoFactorResult>
{
    private const string AuthenticatorUriFormat = "otpauth://totp/{0}:{1}?secret={2}&issuer={0}&digits=6";

    public async ValueTask<SetupTwoFactorResult> Handle(SetupTwoFactorCommand request, CancellationToken cancellationToken)
    {
        var user = await userManager.FindByIdAsync(currentUser.UserId.ToString())
            ?? throw new NotFoundException("User not found.");

        var unformattedKey = await userManager.GetAuthenticatorKeyAsync(user);
        if (string.IsNullOrEmpty(unformattedKey))
        {
            await userManager.ResetAuthenticatorKeyAsync(user);
            unformattedKey = await userManager.GetAuthenticatorKeyAsync(user);
        }
                
        var email = await userManager.GetEmailAsync(user);
        var authenticatorUri = string.Format(
            AuthenticatorUriFormat,
            urlEncoder.Encode("Taska"),
            urlEncoder.Encode(email!),
            unformattedKey);

        return new SetupTwoFactorResult(unformattedKey!, authenticatorUri);
    }
}
