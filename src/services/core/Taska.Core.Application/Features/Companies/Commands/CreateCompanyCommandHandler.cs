using Mapster;
using MassTransit;
using Mediator;
using Taska.Core.Application.Features.Companies.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Core.Domain.Entities;
using Taska.Shared.Enums;
using Taska.Shared.Events;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Companies.Commands;

public class CreateCompanyCommandHandler(ICompanyRepository companyRepository, ICurrentUser currentUser, IPublishEndpoint publishEndpoint) : IRequestHandler<CreateCompanyCommand, CompanyResult>
{
    public async ValueTask<CompanyResult> Handle(CreateCompanyCommand request, CancellationToken cancellationToken)
    {
        if (currentUser.SystemRole != SystemRole.SaasAdmin.ToString() && currentUser.SystemRole != SystemRole.CompanyAdmin.ToString())
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

        var created = await companyRepository.AddAsync(company, cancellationToken);

        await publishEndpoint.Publish(new CompanyCreatedEvent(currentUser.UserId, company.Id), cancellationToken);

        return created.Adapt<CompanyResult>();
    }
}