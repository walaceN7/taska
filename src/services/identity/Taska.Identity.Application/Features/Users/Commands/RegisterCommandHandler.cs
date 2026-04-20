using Mediator;
using Microsoft.AspNetCore.Identity;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Domain.Entities;
using Taska.Identity.Domain.Exceptions;
using Taska.Shared.Enums;

namespace Taska.Identity.Application.Features.Users.Commands;

public class RegisterCommandHandler(UserManager<User> userManager) : IRequestHandler<RegisterCommand, RegisterResult>
{
    public async ValueTask<RegisterResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
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

        return new RegisterResult(user.Id, user.Email!, $"{user.FirstName} {user.LastName}");
    }
}