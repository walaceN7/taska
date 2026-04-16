using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Infrastructure.Persistence.Configurations;

public class TaskAssigneeConfiguration : IEntityTypeConfiguration<TaskAssignee>
{
    public void Configure(EntityTypeBuilder<TaskAssignee> builder)
    {
        builder.HasKey(ta => new { ta.TaskId, ta.UserId });

        builder.HasOne(ta => ta.Task)
            .WithMany(t => t.TaskAssignees)
            .HasForeignKey(ta => ta.TaskId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
