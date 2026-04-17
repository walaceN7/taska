using Mapster;
using Taska.Core.Application.Features.TaskItems.Commands;
using Taska.Core.Application.Features.TaskItems.DTOs;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.TaskItems.Mappings;

public class TaskItemMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CreateTaskItemCommand, TaskItem>();
        config.NewConfig<TaskItem, TaskItemResult>();
    }
}
