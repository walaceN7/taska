using Microsoft.EntityFrameworkCore;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Core.Infrastructure.Persistence;

namespace Taska.Core.Infrastructure.Repositories;

public class AttachmentRepository(TaskaCoreDbContext context) : IAttachmentRepository
{
    public async Task<Attachment> AddAsync(Attachment attachment, CancellationToken cancellationToken = default)
    {
        context.Attachments.Add(attachment);
        await context.SaveChangesAsync(cancellationToken);
        return attachment;
    }

    public async Task<Attachment?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await context.Attachments.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Attachment>> GetByTaskIdAsync(Guid taskId, CancellationToken cancellationToken = default)
    {
        return await context.Attachments
            .Where(a => a.TaskId == taskId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> DeleteAsync(Attachment attachment, CancellationToken cancellationToken = default)
    {
        context.Attachments.Remove(attachment);
        await context.SaveChangesAsync(cancellationToken);
        return true;
    }
}