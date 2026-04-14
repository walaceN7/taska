using Mapster;
using Mediator;
using Taska.Core.Application.Features.Companies.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Exceptions;

namespace Taska.Core.Application.Features.Companies.Commands;

public class UpdateCompanyCommandHandler(ICompanyRepository companyRepository, ICurrentUser currentUser) : IRequestHandler<UpdateCompanyCommand, CompanyResult>
{
    public async ValueTask<CompanyResult> Handle(UpdateCompanyCommand request, CancellationToken cancellationToken)
    {
        var result = await companyRepository.GetByIdAsync(request.Id, cancellationToken) ?? throw new NotFoundException($"Company {request.Id} not found");
        if (request.Name is not null)
            result.Name = request.Name;

        if (request.LogoUrl is not null) 
            result.LogoUrl = request.LogoUrl;

        result.UpdatedBy = currentUser.UserId;
        result.UpdatedAt = DateTime.UtcNow;

        await companyRepository.UpdateAsync(result, cancellationToken);

        return result.Adapt<CompanyResult>();
    }
}
