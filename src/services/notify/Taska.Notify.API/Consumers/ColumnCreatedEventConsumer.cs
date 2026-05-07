using MassTransit;
using Microsoft.AspNetCore.SignalR;
using System.Text.Json;
using Taska.Notify.API.Entities;
using Taska.Notify.API.Hubs;
using Taska.Notify.API.Repositories;
using Taska.Shared.Events;
using Taska.Shared.Notifications;

namespace Taska.Notify.API.Consumers;

public class ColumnCreatedEventConsumer(INotificationRepository repository, IHubContext<BoardHub> hubContext) : IConsumer<ColumnCreatedEvent>
{
    public async Task Consume(ConsumeContext<ColumnCreatedEvent> context)
    {
        var e = context.Message;

        foreach (var recipientId in e.RecipientUserIds)
        {
            if (recipientId == e.ActorUserId) continue;

            var notification = new Notification
            {
                Id = Guid.NewGuid(),
                RecipientUserId = recipientId,
                ActorUserId = e.ActorUserId,
                ActorName = e.ActorName,
                Type = NotificationType.ColumnCreated,
                Payload = JsonSerializer.Serialize(new
                {
                    columnName = e.ColumnName,
                    columnId = e.ColumnId,
                    boardId = e.BoardId
                }),
                BoardId = e.BoardId,
                IsRead = false,
                CreatedAt = e.CreatedAt
            };

            await repository.AddAsync(notification);

            await hubContext.Clients.Group($"user-{recipientId}").SendAsync("NewNotification", notification);
        }

        await hubContext.Clients.Group(e.BoardId.ToString()).SendAsync("ColumnCreated", e);
    }
}