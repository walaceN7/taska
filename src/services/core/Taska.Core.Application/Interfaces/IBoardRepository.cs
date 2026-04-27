using Taska.Core.Domain.Entities;
using Taska.Shared.Pagination;

namespace Taska.Core.Application.Interfaces;

public interface IBoardRepository
{
    Task<Board> AddAsync(Board board, CancellationToken cancellationToken = default);
    Task<Board?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Board>> GetByProjectIdAsync(Guid projectId, CancellationToken cancellationToken = default);
    Task<PagedResult<Board>> GetByProjectIdAsync(Guid projectId, PaginationParams paginationParams, CancellationToken cancellationToken = default);
    Task UpdateAsync(Board board, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Board board, CancellationToken cancellationToken = default);
}