using Taska.Core.Domain.Entities;

namespace Taska.Core.Application.Interfaces;

public interface IColumnRepository
{
    Task<Column> AddAsync(Column column, CancellationToken cancellationToken = default);
    Task<Column?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<Column>> GetByBoardIdAsync(Guid boardId, CancellationToken cancellationToken = default);
    Task<Column> UpdateAsync(Column column, CancellationToken cancellationToken = default);
    Task<int> GetNextOrderAsync(Guid boardId, CancellationToken cancellationToken = default);
    Task<bool> DeleteAsync(Column column, CancellationToken cancellationToken = default);
    Task<List<Column>> GetColumnsWithTasksByBoardIdAsync(Guid boardId, CancellationToken cancellationToken = default);
    Task ShiftOrdersAsync(Guid boardId, int startOrder, int? endOrder, int shiftAmount, CancellationToken cancellationToken = default);
}
