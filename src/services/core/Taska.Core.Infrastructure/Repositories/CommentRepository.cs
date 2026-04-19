using Microsoft.EntityFrameworkCore;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Core.Infrastructure.Persistence;

namespace Taska.Core.Infrastructure.Repositories;

public class CommentRepository(TaskaCoreDbContext context) : ICommentRepository
{
    public async Task<Comment> AddAsync(Comment comment, CancellationToken cancellationToken = default)
    {
        context.Comments.Add(comment);
        await context.SaveChangesAsync(cancellationToken);
        return comment;
    }

    public async Task<Comment> UpdateAsync(Comment comment, CancellationToken cancellationToken = default)
    {
        context.Comments.Update(comment);

        await context.SaveChangesAsync(cancellationToken);
        return comment;
    }

    public async Task<Comment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await context.Comments.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Comment>> GetByTaskIdAsync(Guid taskId, CancellationToken cancellationToken = default)
    {
        return await context.Comments
            .Where(c => c.TaskId == taskId)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Comment comment, CancellationToken cancellationToken = default)
    {
        context.Comments.Remove(comment);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }    
}