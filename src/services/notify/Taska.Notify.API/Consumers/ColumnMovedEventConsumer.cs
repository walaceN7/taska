using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Taska.Notify.API.Hubs;
using Taska.Shared.Events;

namespace Taska.Notify.API.Consumers;

public class ColumnMovedEventConsumer(IHubContext<BoardHub> hubContext) : IConsumer<ColumnMovedEvent>
{
    public async Task Consume(ConsumeContext<ColumnMovedEvent> context)
    {
        var _event = context.Message;
                
        await hubContext.Clients.Group(_event.BoardId.ToString()).SendAsync("ColumnMoved", _event);
    }
}
