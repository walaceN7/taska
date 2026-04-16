using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Infrastructure.Persistence.Configurations;

public class TaskItemConfiguration : BaseEntityConfiguration<TaskItem>
{
    public override void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        base.Configure(builder);

        builder.Property(t => t.Title).IsRequired().HasMaxLength(200);
        builder.Property(t => t.Description).HasMaxLength(2000);
        builder.Property(t => t.Order).IsRequired();

        builder.HasOne(t => t.Column)
            .WithMany(c => c.Tasks)
            .HasForeignKey(t => t.ColumnId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(t => new { t.ColumnId, t.Order });
    }
}
