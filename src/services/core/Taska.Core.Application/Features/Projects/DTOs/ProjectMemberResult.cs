using Taska.Core.Domain.Enums;

namespace Taska.Core.Application.Features.Projects.DTOs;

public record ProjectMemberResult(Guid UserId, ProjectRole Role);
