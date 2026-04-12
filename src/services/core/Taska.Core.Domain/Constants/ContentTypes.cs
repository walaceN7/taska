namespace Taska.Core.Domain.Constants;

public static class ContentTypes
{
    // Images
    public const string Jpeg = "image/jpeg";
    public const string Png = "image/png";
    public const string Gif = "image/gif";
    public const string WebP = "image/webp";

    // Documents
    public const string Pdf = "application/pdf";
    public const string Word = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    public const string Excel = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

    // Text
    public const string PlainText = "text/plain";

    // Archives
    public const string Zip = "application/zip";

    public static readonly string[] Allowed =
    [
        Jpeg, Png, Gif, WebP, Pdf, Word, Excel, PlainText, Zip
    ];
}