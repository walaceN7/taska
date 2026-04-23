using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Taska.Identity.Application.Features.Users.Events;
using Taska.Identity.Application.Interfaces;
using Taska.Identity.Domain.Entities;
using Taska.Identity.Infrastructure.Configurations;
using Taska.Identity.Infrastructure.Persistence;
using Taska.Identity.Infrastructure.Repositories;
using Taska.Identity.Infrastructure.Services;

namespace Taska.Identity.Infrastructure.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<TaskaIdentityDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddDataProtection();

        services.AddIdentityCore<User>(options =>
        {
            options.Password.RequireDigit = true;
            options.Password.RequiredLength = 8;
            options.Password.RequireUppercase = true;
            options.Password.RequireNonAlphanumeric = true;
            options.User.RequireUniqueEmail = true;
            options.SignIn.RequireConfirmedEmail = false;
        })
        .AddRoles<IdentityRole<Guid>>()
        .AddEntityFrameworkStores<TaskaIdentityDbContext>()
        .AddDefaultTokenProviders();

        services.AddDbContext<TaskaIdentityDbContext>(options =>
                options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
           .UseSnakeCaseNamingConvention());

        services.AddHttpContextAccessor();

        services.AddHttpClient<ITurnstileService, TurnstileService>();

        services.AddScoped<ICurrentUser, CurrentUser>();
        services.AddScoped<IJwtService, JwtService>();
        services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
        services.AddScoped<IInvitationRepository, InvitationRepository>();

        services.Configure<SmtpSettings>(configuration.GetSection("SmtpSettings"));

        services.AddTransient<IEmailService, SmtpEmailService>();

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = configuration["Jwt:Issuer"],
                ValidAudience = configuration["Jwt:Audience"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]!)),
                ClockSkew = TimeSpan.Zero
            };
        });

        services.AddMassTransit(x =>
        {
            x.AddConsumer<CompanyCreatedEventConsumer>();

            x.UsingRabbitMq((context, cfg) =>
            {
                var host = configuration["RabbitMQ:Host"] ?? "localhost";
                var port = configuration.GetValue<ushort>("RabbitMQ:Port", 5672);

                cfg.Host(host, port, "/", h =>
                {
                    h.Username(configuration["RabbitMQ:Username"] ?? "taska");
                    h.Password(configuration["RabbitMQ:Password"]!);
                });

                cfg.ConfigureEndpoints(context);
            });
        });



        services.AddAuthorization();

        return services;
    }
}