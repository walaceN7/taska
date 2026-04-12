using Mediator;
using Taska.Core.Application.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Core.Domain.Enums;

namespace Taska.Core.Application.Commands;

public class CreateCompanyCommandHandler(ICompanyRepository companyRepository, ICurrentUser currentUser) : IRequestHandler<CreateCompanyCommand, CompanyResult>
{
    public async ValueTask<CompanyResult> Handle(CreateCompanyCommand request, CancellationToken cancellationToken)
    {
        if (request.Domain is not null)
        {
            var exists = await companyRepository.ExistsByDomainAsync(request.Domain, cancellationToken);
            if (exists)
                throw new Domain.Exceptions.ValidationException("A company with this domain already exists");
        }

        var company = new Company
        {
            Name = request.Name,
            LogoUrl = request.LogoUrl,
            Domain = request.Domain,
            Plan = CompanyPlan.Free,
            CreatedBy = currentUser.UserId,
        };

        var created = await companyRepository.AddAsync(company, cancellationToken);

        return new CompanyResult(
            created.Id,
            created.Name,
            created.LogoUrl,
            created.Domain,
            created.Plan.ToString()
        );
    }
}