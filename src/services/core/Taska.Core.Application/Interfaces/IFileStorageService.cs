namespace Taska.Core.Application.Interfaces;

public interface IFileStorageService
{
    Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken);
    Task<string> GetPresignedUrlAsync(string fileName, CancellationToken cancellationToken);
    Task DeleteAsync(string fileName, CancellationToken cancellationToken);
}
