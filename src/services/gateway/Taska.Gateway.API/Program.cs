using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.RateLimiting;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddReverseProxy().LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddRateLimiter(options =>
{
    options.AddFixedWindowLimiter("fixed", limiter =>
    {
        limiter.PermitLimit = 10;
        limiter.Window = TimeSpan.FromSeconds(10);
        limiter.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        limiter.QueueLimit = 0;
    });

    options.RejectionStatusCode = 429;
});

builder.Services.AddHealthChecks()
    .AddProcessAllocatedMemoryHealthCheck(512, name: "memory", tags: new[] { "memory" })
    .AddDiskStorageHealthCheck(options =>
        options.AddDrive("C:\\", 1024), name: "disk", tags: new[] { "disk" });

builder.Services.AddHealthChecksUI(options =>
{
    options.SetEvaluationTimeInSeconds(10);
    options.AddHealthCheckEndpoint("Identity API", "https://localhost:7096/health");
    options.AddHealthCheckEndpoint("Gateway", "https://localhost:7122/health");
})
.AddInMemoryStorage();

var app = builder.Build();

app.UseRateLimiter();
app.MapReverseProxy().RequireRateLimiting("fixed");
app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});
app.MapHealthChecksUI(options => options.UIPath = "/dashboard");

app.Run();