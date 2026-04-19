using Amazon.S3;
using Amazon.S3.Model;
using Taska.Core.Application.Interfaces;

namespace Taska.Core.Infrastructure.Services;

public class MinioStorageService(IAmazonS3 s3Client, string bucketName) : IFileStorageService
{

    public async Task EnsureBucketExistsAsync()
    {
        var bucketExists = await Amazon.S3.Util.AmazonS3Util.DoesS3BucketExistV2Async(s3Client, bucketName);
        if (!bucketExists)
        {
            await s3Client.PutBucketAsync(new PutBucketRequest { BucketName = bucketName, UseClientRegion = true });
        }
    }

    public async Task<string> UploadAsync(Stream fileStream, string fileName, string contentType, CancellationToken cancellationToken)
    {
        await EnsureBucketExistsAsync();

        var request = new PutObjectRequest
        {
            BucketName = bucketName,
            Key = fileName,
            InputStream = fileStream,
            ContentType = contentType,            
            DisablePayloadSigning = true
        };

        await s3Client.PutObjectAsync(request, cancellationToken);

        return fileName;
    }

    public async Task DeleteAsync(string fileName, CancellationToken cancellationToken)
    {
        var request = new DeleteObjectRequest
        {
            BucketName = bucketName,
            Key = fileName
        };

        await s3Client.DeleteObjectAsync(request, cancellationToken);
    }

    public Task<string> GetPresignedUrlAsync(string fileName, CancellationToken cancellationToken)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = bucketName,
            Key = fileName,
            Expires = DateTime.UtcNow.AddMinutes(15)
        };

        var url = s3Client.GetPreSignedURL(request);
        return Task.FromResult(url);
    }
}