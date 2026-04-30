using HealthChecks.UI.Client;
using MassTransit;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Serilog;
using Taska.Notify.API.Consumers;
using Taska.Notify.API.Hubs;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

var builder = WebApplication.CreateBuilder(args);

builder.Host.UseSerilog((context, services, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration)
    .ReadFrom.Services(services)
    .WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy => policy
        .WithOrigins("http://localhost:3000", "http://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());
});

builder.Services.AddSignalR();

builder.Services.AddMassTransit(x =>
{
    x.AddConsumer<TaskMovedEventConsumer>();
    x.AddConsumer<ColumnCreatedEventConsumer>();
    x.AddConsumer<TaskCreatedEventConsumer>();

    x.UsingRabbitMq((context, cfg) =>
    {
        var host = builder.Configuration["RabbitMQ:Host"] ?? "localhost";
        var port = builder.Configuration.GetValue<ushort>("RabbitMQ:Port", 5672);

        cfg.Host(host, port, "/", h =>
        {
            h.Username(builder.Configuration["RabbitMQ:Username"] ?? "taska");
            h.Password(builder.Configuration["RabbitMQ:Password"]!);
        });

        cfg.ReceiveEndpoint("notify-task-moved", e => e.ConfigureConsumer<TaskMovedEventConsumer>(context));
        cfg.ReceiveEndpoint("notify-column-created", e => e.ConfigureConsumer<ColumnCreatedEventConsumer>(context));
        cfg.ReceiveEndpoint("notify-task-created", e => e.ConfigureConsumer<TaskCreatedEventConsumer>(context));
    });
});

builder.Services.AddOpenApi();

builder.Services.AddHealthChecks()
    .AddProcessAllocatedMemoryHealthCheck(512, name: "memory", tags: new[] { "memory" })
    .AddDiskStorageHealthCheck(options =>
        options.AddDrive("C:\\", 1024), name: "disk", tags: new[] { "disk" });

var app = builder.Build();

app.UseCors("CorsPolicy");

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.MapHub<BoardHub>("/hubs/board");

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.Run();