using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Interfaces;

public interface ICommentRepository
{
    Task<Comment> AddAsync(Comment comment, CancellationToken cancellationToken = default);
    Task<Comment> UpdateAsync(Comment comment, CancellationToken cancellationToken = default);
    Task<Comment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Comment>> GetByTaskIdAsync(Guid taskId, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Comment comment, CancellationToken cancellationToken = default);
}
