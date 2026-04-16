using Mapster;
using Taska.Core.Application.Features.Columns.Commands;
using Taska.Core.Application.Features.Columns.DTOs;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.Columns.Mappings;

public class ColumnMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CreateColumnCommand, Column>();           
        config.NewConfig<Column, ColumnResult>();
    }
}
