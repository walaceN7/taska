using Microsoft.Extensions.DependencyInjection;
using Taska.Identity.Application.Commands;

namespace Taska.Identity.Application.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
            cfg.RegisterServicesFromAssembly(typeof(RegisterCommand).Assembly));

        return services;
    }
}