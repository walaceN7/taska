using Microsoft.EntityFrameworkCore;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Infrastructure.Persistence;

public class TaskaCoreDbContext(DbContextOptions<TaskaCoreDbContext> options, ICurrentUser currentUser) : DbContext(options)
{
    public DbSet<Company> Companies { get; set; }
    public DbSet<Team> Teams { get; set; }
    public DbSet<TeamMember> TeamMembers { get; set; }
    public DbSet<Project> Projects { get; set; }
    public DbSet<ProjectMember> ProjectMembers { get; set; }
    public DbSet<Board> Boards { get; set; }
    public DbSet<Column> Columns { get; set; }
    public DbSet<TaskItem> Tasks { get; set; }
    public DbSet<TaskAssignee> TaskAssignees { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<ChecklistItem> ChecklistItems { get; set; }
    public DbSet<Attachment> Attachments { get; set; }
    public DbSet<ActivityLog> ActivityLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(typeof(TaskaCoreDbContext).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var entries = ChangeTracker.Entries<BaseEntity>();

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedBy = currentUser.UserId;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
                entry.Entity.UpdatedBy = currentUser.UserId;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}