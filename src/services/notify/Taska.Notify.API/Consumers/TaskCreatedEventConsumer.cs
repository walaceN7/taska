using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Taska.Notify.API.Hubs;
using Taska.Shared.Events;

namespace Taska.Notify.API.Consumers;

public class TaskCreatedEventConsumer(IHubContext<BoardHub> hubContext) : IConsumer<TaskCreatedEvent>
{
    public async Task Consume(ConsumeContext<TaskCreatedEvent> context)
    {
        var _event = context.Message;        
        await hubContext.Clients.Group(_event.BoardId.ToString()).SendAsync("TaskCreated", _event);
    }
}