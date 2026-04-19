using Mapster;
using Taska.Core.Application.Features.Comments.Commands;
using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Features.Comments.Mappings;

public class CommentMapping : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<CreateCommentCommand, Comment>();
        config.NewConfig<DeleteCommentCommand, Comment>();
    }
}
