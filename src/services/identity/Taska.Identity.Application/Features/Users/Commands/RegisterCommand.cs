using Mediator;
using Taska.Identity.Application.Features.Users.DTOs;

namespace Taska.Identity.Application.Features.Users.Commands;

public record RegisterCommand(string FirstName, string LastName, string CompanyName, string Email, string Password, int PlanId, string TurnstileToken) : IRequest<RegisterResult>;