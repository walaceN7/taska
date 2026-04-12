using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace Taska.Identity.Infrastructure.Persistence;

public class TaskaIdentityDbContextFactory : IDesignTimeDbContextFactory<TaskaIdentityDbContext>
{
    public TaskaIdentityDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Taska.Identity.API"))
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddUserSecrets("c0f12ff3-0e30-43cc-8cf4-42cd69443659")
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<TaskaIdentityDbContext>();
        optionsBuilder
            .UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
            .UseSnakeCaseNamingConvention();

        return new TaskaIdentityDbContext(optionsBuilder.Options);
    }
}