using FluentValidation;
using Mapster;
using Mediator;
using Microsoft.Extensions.DependencyInjection;
using Taska.Core.Application.Behaviors;

namespace Taska.Core.Application.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediator(options => options.ServiceLifetime = ServiceLifetime.Scoped);
        services.AddValidatorsFromAssembly(typeof(ServiceExtensions).Assembly);
        services.AddScoped(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

        var config = TypeAdapterConfig.GlobalSettings;
        config.Scan(typeof(ServiceExtensions).Assembly);
        services.AddSingleton(config);

        return services;
    }
}