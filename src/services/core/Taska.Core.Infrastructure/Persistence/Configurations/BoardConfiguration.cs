using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Infrastructure.Persistence.Configurations;

public class BoardConfiguration : BaseEntityConfiguration<Board>
{
    public override void Configure(EntityTypeBuilder<Board> builder)
    {
        base.Configure(builder);

        builder.Property(b => b.Name).IsRequired().HasMaxLength(100);
        builder.Property(b => b.Type).IsRequired();

        builder.HasOne(b => b.Project)
            .WithMany(p => p.Boards)
            .HasForeignKey(b => b.ProjectId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(b => b.ProjectId);
    }
}