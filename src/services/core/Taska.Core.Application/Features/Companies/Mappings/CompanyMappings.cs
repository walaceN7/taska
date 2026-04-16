using Mapster;
using Taska.Core.Application.Features.Companies.Commands;
using Taska.Core.Application.Features.Companies.DTOs;
using Taska.Core.Domain.Entities;
using Taska.Core.Domain.Enums;

namespace Taska.Core.Application.Features.Companies.Mappings;

public class CompanyMappings : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CreateCompanyCommand, Company>()
            .Map(dest => dest.Plan, _ => CompanyPlan.Free);

        config.NewConfig<Company, CompanyResult>()
            .Map(dest => dest.Plan, src => src.Plan.ToString());
    }
}