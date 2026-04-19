using Mapster;
using Taska.Core.Application.Features.Assignees.DTOs;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.Assignees.Mappings;

public class AssigneeMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<TaskAssignee, TaskAssigneeResult>();
    }
}