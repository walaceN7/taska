using MassTransit;
using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using Taska.Notify.API.Hubs;
using Taska.Shared.Events;

namespace Taska.Notify.API.Consumers;

public class TaskMovedEventConsumer(IHubContext<BoardHub> hubContext) : IConsumer<TaskMovedEvent>
{
    public async Task Consume(ConsumeContext<TaskMovedEvent> context)
    {
        var _event = context.Message;

        await hubContext.Clients.Group(_event.BoardId.ToString()).SendAsync("TaskMoved", _event);
    }
}
