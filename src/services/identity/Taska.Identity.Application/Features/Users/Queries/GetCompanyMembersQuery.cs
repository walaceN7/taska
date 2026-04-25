using Mediator;
using Taska.Identity.Application.Features.Users.DTOs;

namespace Taska.Identity.Application.Features.Users.Queries;

public record GetCompanyMembersQuery() : IRequest<IEnumerable<MemberDto>>;
