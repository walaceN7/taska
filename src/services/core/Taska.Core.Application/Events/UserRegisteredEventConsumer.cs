using MassTransit;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Shared.Events;

namespace Taska.Core.Application.Events;

public class UserRegisteredEventConsumer(ICompanyRepository repository) : IConsumer<UserRegisteredEvent>
{
    public async Task Consume(ConsumeContext<UserRegisteredEvent> context)
    {
        var message = context.Message;
        var company = new Company
        {
            Name = message.CompanyName,
            Plan = message.PlanId,
            CreatedBy = message.UserId            
        };

        var result = await repository.AddAsync(company, context.CancellationToken);

        await context.Publish(new CompanyCreatedEvent(message.UserId, result.Id), context.CancellationToken);
    }
}
