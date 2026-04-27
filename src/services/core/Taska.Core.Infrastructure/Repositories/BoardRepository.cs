using Microsoft.EntityFrameworkCore;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Core.Infrastructure.Persistence;
using Taska.Shared.Pagination;

namespace Taska.Core.Infrastructure.Repositories;

public class BoardRepository(TaskaCoreDbContext context) : IBoardRepository
{
    public async Task<Board> AddAsync(Board board, CancellationToken cancellationToken = default)
    {
        context.Boards.Add(board);
        await context.SaveChangesAsync(cancellationToken);
        return board;
    }

    public async Task<Board?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await context.Boards.FirstOrDefaultAsync(b => b.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Board>> GetByProjectIdAsync(Guid projectId, CancellationToken cancellationToken = default)
    {
        return await context.Boards.Where(b => b.ProjectId == projectId).AsNoTracking().ToListAsync(cancellationToken);
    }

    public async Task<PagedResult<Board>> GetByProjectIdAsync(Guid projectId, PaginationParams paginationParams, CancellationToken cancellationToken = default)
    {
        return await context.Boards
            .Where(b => b.ProjectId == projectId)
            .Include(b => b.Project)
            .OrderBy(b => b.Name)
            .AsNoTracking()
            .ToPagedResultAsync(paginationParams.PageNumber, paginationParams.PageSize, cancellationToken);
    }

    public async Task UpdateAsync(Board board, CancellationToken cancellationToken = default)
    {
        context.Boards.Update(board);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Board board, CancellationToken cancellationToken = default)
    {
        board.IsActive = !board.IsActive;

        context.Update(board);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}
