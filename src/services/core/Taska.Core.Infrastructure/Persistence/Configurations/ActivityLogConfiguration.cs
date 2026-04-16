using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Infrastructure.Persistence.Configurations;

public class ActivityLogConfiguration : BaseEntityConfiguration<ActivityLog>
{
    public override void Configure(EntityTypeBuilder<ActivityLog> builder)
    {
        base.Configure(builder);

        builder.Property(a => a.Action).IsRequired().HasMaxLength(500);

        builder.HasOne(a => a.Task)
            .WithMany(t => t.ActivityLogs)
            .HasForeignKey(a => a.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(a => a.TaskId);
    }
}
