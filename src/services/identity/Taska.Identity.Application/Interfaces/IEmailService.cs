namespace Taska.Identity.Application.Interfaces;

public interface IEmailService
{
    Task SendInvitationEmailAsync(string toEmail, string token, CancellationToken cancellationToken = default);
    Task SendPasswordResetEmailAsync(string toEmail, string resetUrl, CancellationToken cancellationToken = default);
}
