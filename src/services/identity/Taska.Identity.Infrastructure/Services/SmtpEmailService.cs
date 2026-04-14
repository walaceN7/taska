using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Infrastructure.Configurations;

namespace Taska.Identity.Infrastructure.Services;

public class SmtpEmailService(IOptions<SmtpSettings> smtpSettings) : IEmailService
{
    private readonly SmtpSettings _settings = smtpSettings.Value;

    public async Task SendInvitationEmailAsync(string toEmail, string token, CancellationToken cancellationToken = default)
    {
        var email = new MimeMessage();
        email.From.Add(new MailboxAddress(_settings.FromName, _settings.FromEmail));
        email.To.Add(new MailboxAddress(toEmail, toEmail));
        email.Subject = "Você foi convidado para o TaskFlow!";

        var registerUrl = $"http://localhost:3000/register/invite?token={token}";

        var templatePath = Path.Combine(AppContext.BaseDirectory, "Templates", "InvitationEmail.html");

        var htmlTemplate = await File.ReadAllTextAsync(templatePath, cancellationToken);

        var htmlBody = htmlTemplate.Replace("{{RegisterUrl}}", registerUrl);

        var builder = new BodyBuilder
        {
            HtmlBody = htmlBody
        };

        email.Body = builder.ToMessageBody();

        using var smtp = new SmtpClient();

        try
        {
            await smtp.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls, cancellationToken);
            await smtp.AuthenticateAsync(_settings.Username, _settings.Password, cancellationToken);
            await smtp.SendAsync(email, cancellationToken);
        }
        finally
        {
            await smtp.DisconnectAsync(true, cancellationToken);
        }
    }
}