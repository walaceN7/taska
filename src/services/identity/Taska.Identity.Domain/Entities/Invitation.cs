namespace Taska.Identity.Domain.Entities;

public class Invitation
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public required string Email { get; set; }
    public Guid CompanyId { get; set; }
    public required string Token { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime ExpiresAt { get; set; }
    public DateTime? AcceptedAt { get; set; }
    public Guid InvitedBy { get; set; }
    public bool IsAccepted => AcceptedAt.HasValue;
}
