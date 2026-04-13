using Mapster;
using Taska.Core.Application.Commands;
using Taska.Core.Application.DTOs;
using Taska.Core.Domain.Entities;
using Taska.Core.Domain.Enums;

namespace Taska.Core.Application.Mappings;

public class CompanyMappings : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CreateCompanyCommand, Company>()
            .Map(dest => dest.Id, _ => Guid.NewGuid())
            .Map(dest => dest.CreatedAt, _ => DateTime.UtcNow)
            .Map(dest => dest.Plan, _ => CompanyPlan.Free);

        config.NewConfig<Company, CompanyResult>()
            .Map(dest => dest.Plan, src => src.Plan.ToString());
    }
}