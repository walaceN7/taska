using Microsoft.EntityFrameworkCore;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Core.Infrastructure.Persistence;

namespace Taska.Core.Infrastructure.Repositories;

public class TaskAssigneeRepository(TaskaCoreDbContext context) : ITaskAssigneeRepository
{
    public async Task<TaskAssignee> AddAsync(TaskAssignee assignee, CancellationToken cancellationToken = default)
    {
        context.TaskAssignees.Add(assignee);
        await context.SaveChangesAsync(cancellationToken);
        return assignee;
    }

    public async Task<bool> ExistsAsync(Guid taskId, Guid userId, CancellationToken cancellationToken = default)
    {
        return await context.TaskAssignees.AnyAsync(a => a.TaskId == taskId && a.UserId == userId, cancellationToken);
    }

    public async Task<IEnumerable<TaskAssignee>> GetByTaskIdAsync(Guid taskId, CancellationToken cancellationToken = default)
    {
        return await context.TaskAssignees
            .Where(a => a.TaskId == taskId)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> RemoveAsync(Guid taskId, Guid userId, CancellationToken cancellationToken = default)
    {
        var assignee = await context.TaskAssignees
            .FirstOrDefaultAsync(a => a.TaskId == taskId && a.UserId == userId, cancellationToken);

        if (assignee == null) return false;

        context.TaskAssignees.Remove(assignee);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}