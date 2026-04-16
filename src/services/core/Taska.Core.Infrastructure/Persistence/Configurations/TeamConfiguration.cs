using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Infrastructure.Persistence.Configurations;

public class TeamConfiguration : BaseEntityConfiguration<Team>
{
    public override void Configure(EntityTypeBuilder<Team> builder)
    {
        base.Configure(builder);

        builder.Property(t => t.Name).IsRequired().HasMaxLength(100);
        builder.Property(t => t.Description).HasMaxLength(1000);

        builder.HasOne(t => t.Company)
            .WithMany(c => c.Teams)
            .HasForeignKey(t => t.CompanyId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(t => t.CompanyId);
    }
}