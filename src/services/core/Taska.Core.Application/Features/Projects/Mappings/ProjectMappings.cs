using Mapster;
using Taska.Core.Application.Features.Projects.Commands;
using Taska.Core.Application.Features.Projects.DTOs;
using Taska.Core.Domain.Entities;
using Taska.Core.Domain.Enums;

namespace Taska.Core.Application.Features.Projects.Mappings;

public class ProjectMappings : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CreateProjectCommand, Project>()
            .Map(dest => dest.Id, _ => Guid.NewGuid())
            .Map(dest => dest.CreatedAt, _ => DateTime.UtcNow)
            .Map(dest => dest.Status, _ => ProjectStatus.Planning)
            .Map(dest => dest.StartDate, src => src.StartDate.HasValue
                ? DateTime.SpecifyKind(src.StartDate.Value, DateTimeKind.Utc)
                : (DateTime?)null)
            .Map(dest => dest.EndDate, src => src.EndDate.HasValue
                ? DateTime.SpecifyKind(src.EndDate.Value, DateTimeKind.Utc)
                : (DateTime?)null);

        config.NewConfig<Project, ProjectResult>()
            .Map(dest => dest.Status, src => src.Status.ToString());
    }
}
