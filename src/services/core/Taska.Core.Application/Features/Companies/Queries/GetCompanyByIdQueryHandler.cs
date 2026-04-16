using Mapster;
using Mediator;
using Taska.Core.Application.Features.Companies.DTOs;
using Taska.Core.Application.Interfaces;
using Taska.Shared.Exceptions;

namespace Taska.Core.Application.Features.Companies.Queries;

public class GetCompanyByIdQueryHandler(ICompanyRepository companyRepository) : IRequestHandler<GetCompanyByIdQuery, CompanyResult>
{
    private readonly ICompanyRepository _companyRepository = companyRepository;
    public async ValueTask<CompanyResult> Handle(GetCompanyByIdQuery request, CancellationToken cancellationToken)
    {
        var result = await _companyRepository.GetByIdAsync(request.Id, cancellationToken);

        return result is null ? throw new NotFoundException($"Company with id {request.Id} not found.") : result.Adapt<CompanyResult>();
    }
}
