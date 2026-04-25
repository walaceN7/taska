using Mapster;
using Taska.Identity.Application.Features.Invitations.DTOs;
using Taska.Identity.Application.Features.Users.DTOs;
using Taska.Identity.Domain.Entities;

namespace Taska.Identity.Application.Mappings;

public class IdentityMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<User, MemberDto>()
            .Map(dest => dest.FullName, src => src.FirstName + " " + src.LastName)
            .Map(dest => dest.SystemRole, src => src.SystemRole.ToString());

        config.NewConfig<Invitation, PendingInviteDto>()
            .Map(dest => dest.SentAt, src => src.CreatedAt);
    }
}