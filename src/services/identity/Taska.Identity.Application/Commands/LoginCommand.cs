using MediatR;
using Taska.Identity.Application.DTOs;

namespace Taska.Identity.Application.Commands;

public record LoginCommand(string Email, string Password) : IRequest<LoginResult>;