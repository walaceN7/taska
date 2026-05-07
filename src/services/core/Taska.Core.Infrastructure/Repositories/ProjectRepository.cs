using Microsoft.EntityFrameworkCore;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Core.Infrastructure.Persistence;
using Taska.Shared.Enums;
using Taska.Shared.Pagination;

namespace Taska.Core.Infrastructure.Repositories;

public class ProjectRepository(TaskaCoreDbContext context) : IProjectRepository
{

    public async Task<Project> AddAsync(Project project, CancellationToken cancellationToken)
    {
        await context.Projects.AddAsync(project, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);

        return await context.Projects
            .Include(p => p.Company)
            .FirstAsync(p => p.Id == project.Id, cancellationToken);
    }

    public async Task<Project?> GetByIdAsync(Guid id, CancellationToken cancellationToken)
    {
        return await context.Projects
            .Include(p => p.Company)
            .Include(p => p.ProjectMembers)
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);
    }

    public async Task<ICollection<Project>> GetByCompanyAsync(Guid userId, string systemRole, Guid companyId, CancellationToken cancellationToken)
    {
        var query = context.Projects
            .Include(p => p.Company)
            .Where(p => p.CompanyId == companyId)
            .AsNoTracking()
            .AsQueryable();

        if (systemRole != SystemRole.SaasAdmin.ToString() && systemRole != SystemRole.CompanyAdmin.ToString())
        {
            query = query.Where(p => p.ProjectMembers.Any(u => u.UserId == userId));
        }

        return await query.ToListAsync(cancellationToken);
    }

    public async Task<PagedResult<Project>> GetByCompanyAsync(Guid userId, string systemRole, Guid companyId, PaginationParams paginationParams, CancellationToken cancellationToken)
    {
        var query = context.Projects
            .Include(p => p.Company)
            .Where(p => p.CompanyId == companyId)
            .OrderBy(p => p.Name)
            .AsNoTracking()
            .AsQueryable();

        if (systemRole != "SaasAdmin" && systemRole != "CompanyAdmin")
        {
            query = query.Where(p => p.ProjectMembers.Any(u => u.UserId == userId));
        }

        return await query.ToPagedResultAsync(paginationParams.PageNumber, paginationParams.PageSize, cancellationToken);
    }

    public async Task<Project> UpdateAsync(Project project, CancellationToken cancellationToken)
    {
        context.Projects.Update(project);
        await context.SaveChangesAsync(cancellationToken);
        return project;
    }

    public async Task AddMemberAsync(ProjectMember member, CancellationToken cancellationToken)
    {
        await context.ProjectMembers.AddAsync(member, cancellationToken);
        await context.SaveChangesAsync(cancellationToken);
    }

    public async Task RemoveMemberAsync(Project project, Guid userId, CancellationToken cancellationToken)
    {
        var member = project.ProjectMembers.FirstOrDefault(m => m.UserId == userId);
        if (member != null)
        {
            context.ProjectMembers.Remove(member);
            await context.SaveChangesAsync(cancellationToken);
        }
    }
    public async Task<bool> IsMemberAsync(Guid projectId, Guid userId, CancellationToken cancellationToken)
    {
        return await context.ProjectMembers.AnyAsync(pm => pm.ProjectId == projectId && pm.UserId == userId, cancellationToken);
    }
    
}