using FluentValidation;
using Mediator;
using Microsoft.Extensions.DependencyInjection;
using Taska.Identity.Application.Behaviors;
using Taska.Identity.Application.Validators;

namespace Taska.Identity.Application.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediator(options => options.ServiceLifetime = ServiceLifetime.Scoped);
        services.AddValidatorsFromAssembly(typeof(RegisterCommandValidator).Assembly);
        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

        return services;
    }
}