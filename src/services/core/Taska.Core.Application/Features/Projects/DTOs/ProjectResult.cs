using Taska.Core.Domain.Enums;

namespace Taska.Core.Application.Features.Projects.DTOs;

public record ProjectResult(Guid Id, string Name, DateTime? StartDate, DateTime? EndDate, ProjectStatus Status, Guid CompanyId, string CompanyName);
