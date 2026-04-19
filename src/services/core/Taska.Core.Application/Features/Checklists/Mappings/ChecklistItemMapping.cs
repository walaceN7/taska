using Mapster;
using Taska.Core.Application.Features.Checklists.Commands;
using Taska.Core.Application.Features.Checklists.DTOs;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.Checklists.Mappings;

public class ChecklistItemMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CreateChecklistItemCommand, ChecklistItem>();
        config.NewConfig<ChecklistItem, ChecklistItemResult>();
    }
}
