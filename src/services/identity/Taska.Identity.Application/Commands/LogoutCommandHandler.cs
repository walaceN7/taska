using Mediator;
using Taska.Identity.Application.Interfaces;

namespace Taska.Identity.Application.Commands;

public class LogoutCommandHandler(IRefreshTokenRepository refreshTokenRepository) : IRequestHandler<LogoutCommand>
{
    private readonly IRefreshTokenRepository _refreshTokenRepository = refreshTokenRepository;

    public async ValueTask<Unit> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        var refreshToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshToken, cancellationToken);

        if (refreshToken == null || refreshToken.IsRevoked)
            return Unit.Value;
        
        refreshToken.RevokedReason = "logout";
        await _refreshTokenRepository.RevokeAsync(refreshToken, cancellationToken);

        return Unit.Value;
    }
}