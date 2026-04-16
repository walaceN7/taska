using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Interfaces;

public interface IColumnRepository
{
    Task<Column> AddAsync(Column column, CancellationToken cancellationToken = default);
    Task<List<Column>> GetByBoardIdAsync(Guid boardId, CancellationToken cancellationToken = default);
    Task<int> GetNextOrderAsync(Guid boardId, CancellationToken cancellationToken = default);
}
