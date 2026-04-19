using Amazon.S3;
using MassTransit;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Taska.Core.Application.Interfaces;
using Taska.Core.Infrastructure.Persistence;
using Taska.Core.Infrastructure.Repositories;
using Taska.Core.Infrastructure.Services;

namespace Taska.Core.Infrastructure.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<TaskaCoreDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                   .UseSnakeCaseNamingConvention());

        services.AddHttpContextAccessor();

        services.AddScoped<ICurrentUser, CurrentUser>();
        services.AddScoped<ICompanyRepository, CompanyRepository>();
        services.AddScoped<IProjectRepository, ProjectRepository>();
        services.AddScoped<IBoardRepository, BoardRepository>();
        services.AddScoped<IColumnRepository, ColumnRepository>();
        services.AddScoped<ITaskItemRepository, TaskItemRepository>();
        services.AddScoped<IChecklistItemRepository, ChecklistItemRepository>();
        services.AddScoped<ICommentRepository, CommentRepository>();
        services.AddScoped<IAttachmentRepository, AttachmentRepository>();
        services.AddScoped<ITaskAssigneeRepository, TaskAssigneeRepository>();

        var s3Config = new AmazonS3Config
        {
            ServiceURL = configuration["Storage:ServiceURL"],
            ForcePathStyle = true
        };
                
        services.AddSingleton<IAmazonS3>(sp =>
            new AmazonS3Client(
                configuration["Storage:AccessKey"],
                configuration["Storage:SecretKey"],
                s3Config));

        services.AddScoped<IFileStorageService>(sp =>
        {
            var s3Client = sp.GetRequiredService<IAmazonS3>();
            var bucketName = configuration["Storage:BucketName"] ?? "taska-attachments";
            return new MinioStorageService(s3Client, bucketName);
        });

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
                IssuerSigningKey = new SymmetricSecurityKey(
                    Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]!)),
                ClockSkew = TimeSpan.Zero
            };
        });

        services.AddMassTransit(x =>
        {
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