using Mapster;
using Taska.Core.Application.Features.Boards.Commands;
using Taska.Core.Application.Features.Boards.DTOs;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.Boards.Mappings;

public class BoardMappings : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CreateBoardCommand, Board>();
        config.NewConfig<Board, BoardResult>();
    }
}
