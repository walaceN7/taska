using MassTransit;
using Microsoft.AspNetCore.SignalR;
using Taska.Notify.API.Hubs;
using Taska.Shared.Events;

namespace Taska.Notify.API.Consumers;

public class ColumnCreatedEventConsumer(IHubContext<BoardHub> hubContext) : IConsumer<ColumnCreatedEvent>
{
    public async Task Consume(ConsumeContext<ColumnCreatedEvent> context)
    {
        var _event = context.Message;        
        await hubContext.Clients.Group(_event.BoardId.ToString()).SendAsync("ColumnCreated", _event);
    }
}