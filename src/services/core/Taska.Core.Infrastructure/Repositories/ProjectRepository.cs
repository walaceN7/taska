using Microsoft.EntityFrameworkCore;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Core.Infrastructure.Persistence;

namespace Taska.Core.Infrastructure.Repositories;

public class ProjectRepository(TaskaCoreDbContext context) : IProjectRepository
{
    private readonly TaskaCoreDbContext _context = context;

    public async Task<Project> AddAsync(Project project, CancellationToken cancellationToken)
    {
        await _context.Projects.AddAsync(project, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);

        return await _context.Projects
            .Include(p => p.Company)
            .FirstAsync(p => p.Id == project.Id, cancellationToken);
    }

    public async Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await _context.Projects
            .Include(p => p.Company)
            .Include(p => p.ProjectMembers)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<ICollection<Project>> GetByCompanyAsync(Guid companyId, CancellationToken cancellationToken)
    {
        return await _context.Projects
            .Include(p => p.Company)
            .Where(p => p.CompanyId == companyId)
            .ToListAsync(cancellationToken);
    }

    public async Task<Project> UpdateAsync(Project project, CancellationToken cancellationToken)
    {
        _context.Projects.Update(project);
        await _context.SaveChangesAsync(cancellationToken);
        return project;
    }

    public async Task AddMemberAsync(ProjectMember member, CancellationToken cancellationToken)
    {
        await _context.ProjectMembers.AddAsync(member, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<bool> IsMemberAsync(Guid projectId, Guid userId, CancellationToken cancellationToken)
    {
        return await _context.ProjectMembers
            .AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == userId, cancellationToken);
    }
    
}