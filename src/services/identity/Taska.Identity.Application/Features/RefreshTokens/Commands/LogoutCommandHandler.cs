using Mediator;
using Taska.Identity.Application.Interfaces;

namespace Taska.Identity.Application.Features.RefreshTokens.Commands;

public class LogoutCommandHandler(IRefreshTokenRepository refreshTokenRepository) : IRequestHandler<LogoutCommand>
{
    private readonly IRefreshTokenRepository refreshTokenRepository = refreshTokenRepository;

    public async ValueTask<Unit> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var refreshToken = await refreshTokenRepository.GetByTokenAsync(request.RefreshToken, cancellationToken);

        if (refreshToken == null || refreshToken.IsRevoked)
            return Unit.Value;
        
        refreshToken.RevokedReason = "logout";
        await refreshTokenRepository.RevokeAsync(refreshToken, cancellationToken);

        return Unit.Value;
    }
}