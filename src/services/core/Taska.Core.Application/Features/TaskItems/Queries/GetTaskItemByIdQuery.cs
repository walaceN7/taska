using Mediator;
using Taska.Core.Application.Features.TaskItems.DTOs;

namespace Taska.Core.Application.Features.TaskItems.Queries;

public record GetTaskItemByIdQuery(Guid Id) : IRequest<TaskItemResult>;
