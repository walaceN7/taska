using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Taska.Core.Application.Interfaces;

namespace Taska.Core.Infrastructure.Persistence;

public class TaskaCoreDbContextFactory : IDesignTimeDbContextFactory<TaskaCoreDbContext>
{
    public TaskaCoreDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../Taska.Core.API"))
            .AddJsonFile("appsettings.json", optional: false)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .AddUserSecrets("f51b7db7-2ad5-4b83-a8e7-a39e8eddfb22")
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<TaskaCoreDbContext>();
        optionsBuilder
            .UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
            .UseSnakeCaseNamingConvention();

        var dummyUser = new DesignTimeCurrentUser();

        return new TaskaCoreDbContext(optionsBuilder.Options, dummyUser);
    }

    private class DesignTimeCurrentUser : ICurrentUser
    {
        public Guid UserId => Guid.Empty;

        public Guid? CompanyId => Guid.Empty;

        public string Email => string.Empty;

        public string SystemRole => string.Empty;
    }
}
