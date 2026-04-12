using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Taska.Identity.Domain.Entities;

namespace Taska.Identity.Infrastructure.Persistence;

public class TaskaIdentityDbContext(DbContextOptions<TaskaIdentityDbContext> options) : IdentityDbContext<User, IdentityRole<Guid>, Guid>(options)
{
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfigurationsFromAssembly(typeof(TaskaIdentityDbContext).Assembly);
    }
}