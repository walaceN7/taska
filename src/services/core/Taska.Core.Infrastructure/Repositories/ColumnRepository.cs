using Microsoft.EntityFrameworkCore;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Core.Infrastructure.Persistence;

namespace Taska.Core.Infrastructure.Repositories;

public class ColumnRepository(TaskaCoreDbContext context) : IColumnRepository
{
    public async Task<Column> AddAsync(Column column, CancellationToken cancellationToken = default)
    {
        context.Columns.Add(column);
        await context.SaveChangesAsync(cancellationToken);
        return column;
    }

    public async Task<bool> DeleteAsync(Column column, CancellationToken cancellationToken = default)
    {
        column.IsActive = !column.IsActive;
        context.Update(column);
        await context.SaveChangesAsync(cancellationToken);

        return true;
    }

    public async Task<List<Column>> GetByBoardIdAsync(Guid boardId, CancellationToken cancellationToken = default)
    {
        return await context.Columns.Where(c => c.BoardId == boardId).OrderBy(c => c.Order).AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<Column?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await context.Columns.FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<int> GetNextOrderAsync(Guid boardId, CancellationToken cancellationToken = default)
    {
        return await context.Columns.Where(c => c.BoardId == boardId).MaxAsync(c => (int?)c.Order, cancellationToken) + 1 ?? 0;
    }

    public async Task<Column> UpdateAsync(Column column, CancellationToken cancellationToken = default)
    {
        context.Update(column);
        await context.SaveChangesAsync(cancellationToken);

        return column;
    }

    public async Task<List<Column>> GetColumnsWithTasksByBoardIdAsync(Guid boardId, CancellationToken cancellationToken = default)
    {
        return await context.Columns
            .Where(c => c.BoardId == boardId)
            .Include(c => c.Tasks.Where(t => t.IsActive).OrderBy(t => t.Order))
            .OrderBy(c => c.Order)
            .AsNoTracking()
            .ToListAsync(cancellationToken);
    }
    
    public async Task ShiftOrdersAsync(Guid boardId, int startOrder, int? endOrder, int shiftAmount, CancellationToken cancellationToken = default)
    {
        var query = context.Columns.Where(c => c.BoardId == boardId && c.Order >= startOrder);

        if (endOrder.HasValue)
        {
            query = query.Where(c => c.Order <= endOrder.Value);
        }

        await query.ExecuteUpdateAsync(s => s.SetProperty(c => c.Order, c => c.Order + shiftAmount), cancellationToken);
    }
}
