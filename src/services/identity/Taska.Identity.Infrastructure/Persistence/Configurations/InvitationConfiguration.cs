using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Taska.Identity.Domain.Entities;

namespace Taska.Identity.Infrastructure.Persistence.Configurations;

public class InvitationConfiguration : IEntityTypeConfiguration<Invitation>
{
    public void Configure(EntityTypeBuilder<Invitation> builder)
    {
        builder.HasKey(i => i.Id);

        builder.Property(i => i.Email)
            .IsRequired()
            .HasMaxLength(150);

        builder.Property(i => i.Token)
            .IsRequired()
            .HasMaxLength(100);
                
        builder.HasIndex(i => i.Token).IsUnique();
    }
}
