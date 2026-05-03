namespace Taska.Notify.API.Entities;

public class Notification
{
    public Guid Id { get; set; }
    public Guid RecipientUserId { get; set; }
    public Guid ActorUserId { get; set; }
    public required string ActorName { get; set; }
    public required string Type { get; set; }
    public required string Payload { get; set; }
    public Guid BoardId { get; set; }
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}