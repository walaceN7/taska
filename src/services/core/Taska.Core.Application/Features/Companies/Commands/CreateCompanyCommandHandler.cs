using Mapster;
using Mediator;
using Taska.Core.Application.Features.Companies.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Constants;
using Taska.Core.Domain.Entities;
using Taska.Core.Domain.Exceptions;

namespace Taska.Core.Application.Features.Companies.Commands;

public class CreateCompanyCommandHandler(ICompanyRepository companyRepository, ICurrentUser currentUser) : IRequestHandler<CreateCompanyCommand, CompanyResult>
{
    public async ValueTask<CompanyResult> Handle(CreateCompanyCommand request, CancellationToken cancellationToken)
    {
        if (currentUser.SystemRole != SystemRoles.SaasAdmin && currentUser.SystemRole != SystemRoles.CompanyAdmin)
            throw new UnauthorizedException("Only admins can create a company");

        if (currentUser.CompanyId.HasValue)
            throw new ValidationException("User already belongs to a company");

        if (request.Domain is not null)
        {
            var exists = await companyRepository.ExistsByDomainAsync(request.Domain, cancellationToken);
            if (exists)
                throw new ValidationException("A company with this domain already exists");
        }

        var company = request.Adapt<Company>();
        company.CreatedBy = currentUser.UserId;

        var created = await companyRepository.AddAsync(company, cancellationToken);

        return created.Adapt<CompanyResult>();
    }
}