using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Infrastructure.Persistence.Configurations;

public class ColumnConfiguration : BaseEntityConfiguration<Column>
{
    public override void Configure(EntityTypeBuilder<Column> builder)
    {
        base.Configure(builder);

        builder.Property(c => c.Name).IsRequired().HasMaxLength(100);
        builder.Property(c => c.Order).IsRequired();

        builder.HasOne(c => c.Board)
            .WithMany(b => b.Columns)
            .HasForeignKey(c => c.BoardId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(c => new { c.BoardId, c.Order });
    }
}
