using MediatR;
using Taska.Identity.Application.DTOs;

namespace Taska.Identity.Application.Commands;

public record RegisterCommand(string FirstName, string LastName, string Email, string Password, Guid CompanyId) : IRequest<RegisterResult>;