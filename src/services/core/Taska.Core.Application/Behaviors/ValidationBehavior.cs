using FluentValidation;
using Mediator;

namespace Taska.Core.Application.Behaviors;

public class ValidationBehavior<TRequest, TResponse>(IEnumerable<IValidator<TRequest>> validators) : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull, IMessage
{
    private readonly IEnumerable<IValidator<TRequest>> _validators = validators;

    public async ValueTask<TResponse> Handle(TRequest message, MessageHandlerDelegate<TRequest, TResponse> next, CancellationToken cancellationToken)
    {
        if (!_validators.Any())
            return await next(message, cancellationToken);

        var context = new ValidationContext<TRequest>(message);
        var errors = _validators
            .Select(v => v.Validate(context))
            .SelectMany(r => r.Errors)
            .Where(e => e != null)
            .ToList();

        if (errors.Any())
        {
            var errorMessages = string.Join(", ", errors.Select(e => e.ErrorMessage));
            throw new Domain.Exceptions.ValidationException(errorMessages);
        }

        return await next(message, cancellationToken);
    }
}