using Mediator;
using Microsoft.AspNetCore.Identity;
using Taska.Identity.Application.DTOs;
using Taska.Identity.Domain.Entities;
using Taska.Identity.Domain.Exceptions;

namespace Taska.Identity.Application.Commands;

public class RegisterCommandHandler(UserManager<User> userManager) : IRequestHandler<RegisterCommand, RegisterResult>
{
    private readonly UserManager<User> _userManager = userManager;

    public async ValueTask<RegisterResult> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            UserName = request.Email,
            CompanyId = request.CompanyId,
            CreatedAt = DateTime.UtcNow,
            SystemRole = Domain.Enums.SystemRole.Member
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
        {
            var errors = string.Join(", ", result.Errors.Select(e => e.Description));
            throw new ValidationException(errors);
        }

        return new RegisterResult(user.Id, user.Email!, $"{user.FirstName} {user.LastName}");
    }
}