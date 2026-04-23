using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Taska.Identity.Application.Interfaces;

namespace Taska.Identity.Infrastructure.Services;

public class TurnstileService(HttpClient httpClient, IConfiguration configuration) : ITurnstileService
{
    public async Task<bool> VerifyTokenAsync(string token, CancellationToken cancellationToken)
    {
        var secretKey = configuration["CloudflareTurnstile:SecretKey"];

        var content = new FormUrlEncodedContent([
            new KeyValuePair<string, string>("secret", secretKey!),
            new KeyValuePair<string, string>("response", token)
        ]);

        var response = await httpClient.PostAsync("https://challenges.cloudflare.com/turnstile/v0/siteverify", content, cancellationToken);

        if (!response.IsSuccessStatusCode) return false;

        var result = await response.Content.ReadFromJsonAsync<TurnstileResponse>(cancellationToken: cancellationToken);
        return result?.Success ?? false;
    }

    private class TurnstileResponse
    {
        [JsonPropertyName("success")]
        public bool Success { get; set; }
    }
}
