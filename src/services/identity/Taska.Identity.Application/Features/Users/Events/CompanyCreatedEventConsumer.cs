using MassTransit;
using Microsoft.AspNetCore.Identity;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Events;

namespace Taska.Identity.Application.Features.Users.Events;

public class CompanyCreatedEventConsumer(UserManager<User> userManager) : IConsumer<CompanyCreatedEvent>
{
    public async Task Consume(ConsumeContext<CompanyCreatedEvent> context)
    {        
        var message = context.Message;

        var user = await userManager.FindByIdAsync(message.UserId.ToString());

        if (user != null)
        {            
            user.CompanyId = message.CompanyId;
                     
            await userManager.UpdateAsync(user);
        }
    }
}