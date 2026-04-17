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

    public async Task<List<Column>> GetByBoardIdAsync(Guid boardId, CancellationToken cancellationToken = default)
    {
        return await context.Columns.Where(c => c.BoardId == boardId).OrderBy(c => c.Order).AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<int> GetNextOrderAsync(Guid boardId, CancellationToken cancellationToken = default)
    {
        return await context.Columns.Where(c => c.BoardId == boardId).MaxAsync(c => (int?)c.Order, cancellationToken) + 1 ?? 0;
    }
}
