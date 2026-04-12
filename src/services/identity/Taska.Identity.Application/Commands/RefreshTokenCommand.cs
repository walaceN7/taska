using MediatR;
using Taska.Identity.Application.DTOs;

namespace Taska.Identity.Application.Commands;

public record RefreshTokenCommand(string RefreshToken) : IRequest<LoginResult>;