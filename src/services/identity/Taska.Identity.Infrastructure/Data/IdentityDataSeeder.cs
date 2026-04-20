using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Taska.Identity.Domain.Entities;
using Taska.Shared.Enums;

namespace Taska.Identity.Infrastructure.Data;

public static class IdentityDataSeeder
{
    public static async Task SeedSaasAdminAsync(IServiceProvider serviceProvider, IConfiguration configuration)
    {
        using var scope = serviceProvider.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

        var adminEmail = configuration["SaasAdminSetup:Email"];
        var adminPassword = configuration["SaasAdminSetup:Password"];

        if (string.IsNullOrEmpty(adminEmail) || string.IsNullOrEmpty(adminPassword))
            return;

        var existingAdmin = await userManager.FindByEmailAsync(adminEmail);

        if (existingAdmin == null)
        {
            var adminUser = new User
            {
                UserName = adminEmail,
                Email = adminEmail,
                FirstName = configuration["SaasAdminSetup:FirstName"] ?? "SaaS",
                LastName = configuration["SaasAdminSetup:LastName"] ?? "Admin",
                SystemRole = SystemRole.SaasAdmin,
                CompanyId = null,
                CreatedAt = DateTime.UtcNow,
                EmailConfirmed = true
            };

            await userManager.CreateAsync(adminUser, adminPassword);
        }
    }
}