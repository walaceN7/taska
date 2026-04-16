using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Infrastructure.Persistence.Configurations;

public class ChecklistItemConfiguration : BaseEntityConfiguration<ChecklistItem>
{
    public override void Configure(EntityTypeBuilder<ChecklistItem> builder)
    {
        base.Configure(builder);

        builder.Property(c => c.Title).IsRequired().HasMaxLength(200);
        builder.Property(c => c.Order).IsRequired();

        builder.HasOne(c => c.Task)
            .WithMany(t => t.ChecklistItems)
            .HasForeignKey(c => c.TaskId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(c => new { c.TaskId, c.Order });
    }
}
