using System;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace AccArenas.Api.Infrastructure.Data
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
            var roleManager = scope.ServiceProvider.GetRequiredService<
                RoleManager<ApplicationRole>
            >();
            var userManager = scope.ServiceProvider.GetRequiredService<
                UserManager<ApplicationUser>
            >();

            // Ensure database is created
            await context.Database.MigrateAsync();

            // Seed roles if they don't exist
            await SeedRolesAsync(roleManager);

            // Seed users
            await SeedAdminUserAsync(userManager);
            await SeedTestUsersAsync(userManager);
        }

        private static async Task SeedRolesAsync(RoleManager<ApplicationRole> roleManager)
        {
            var roles = new[]
            {
                new ApplicationRole
                {
                    Name = "Admin",
                    Description = "Administrator with full system access",
                },
                new ApplicationRole
                {
                    Name = "Customer",
                    Description = "Customer who can purchase game accounts",
                },
                new ApplicationRole
                {
                    Name = "SalesStaff",
                    Description = "Sales staff managing order fulfillment",
                },
                new ApplicationRole
                {
                    Name = "MarketingStaff",
                    Description = "Marketing staff managing content and promotions",
                },
            };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role.Name!))
                {
                    await roleManager.CreateAsync(role);
                }
            }
        }

        private static async Task SeedAdminUserAsync(UserManager<ApplicationUser> userManager)
        {
            var adminEmail = "admin@accarenas.com";
            var adminUser = await userManager.FindByEmailAsync(adminEmail);

            if (adminUser == null)
            {
                adminUser = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    UserName = adminEmail,
                    Email = adminEmail,
                    EmailConfirmed = true,
                    FullName = "System Administrator",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true,
                };

                var result = await userManager.CreateAsync(adminUser, "Admin@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }
        }

        private static async Task SeedTestUsersAsync(UserManager<ApplicationUser> userManager)
        {
            // Customer test user
            var customerEmail = "customer@test.com";
            var customerUser = await userManager.FindByEmailAsync(customerEmail);
            if (customerUser == null)
            {
                customerUser = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    UserName = "customer",
                    Email = customerEmail,
                    EmailConfirmed = true,
                    FullName = "Test Customer",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true,
                };

                var result = await userManager.CreateAsync(customerUser, "Test@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(customerUser, "Customer");
                }
            }

            // Simple test user
            var testEmail = "test@test.com";
            var testUser = await userManager.FindByEmailAsync(testEmail);
            if (testUser == null)
            {
                testUser = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    UserName = "test",
                    Email = testEmail,
                    EmailConfirmed = true,
                    FullName = "Test User",
                    CreatedAt = DateTime.UtcNow,
                    IsActive = true,
                };

                var result = await userManager.CreateAsync(testUser, "Test@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(testUser, "Customer");
                }
            }

            // Marketing Staff user
            var marketerEmail = "marketer@accarenas.com";
            var marketerUser = await userManager.FindByEmailAsync(marketerEmail);
            if (marketerUser == null)
            {
                marketerUser = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    UserName = marketerEmail,
                    Email = marketerEmail,
                    EmailConfirmed = true,
                    FullName = "Nguyen Van Marketer",
                    CreatedAt = DateTime.UtcNow.AddDays(-20),
                    IsActive = true,
                };

                var result = await userManager.CreateAsync(marketerUser, "Marketer@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(marketerUser, "MarketingStaff");
                }
            }

            // Marketing Lead user
            var marketerLeadEmail = "marketer.lead@accarenas.com";
            var marketerLeadUser = await userManager.FindByEmailAsync(marketerLeadEmail);
            if (marketerLeadUser == null)
            {
                marketerLeadUser = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    UserName = marketerLeadEmail,
                    Email = marketerLeadEmail,
                    EmailConfirmed = true,
                    FullName = "Le Van Marketing Lead",
                    CreatedAt = DateTime.UtcNow.AddDays(-25),
                    IsActive = true,
                };

                var result = await userManager.CreateAsync(marketerLeadUser, "MarketerLead@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(marketerLeadUser, "MarketingStaff");
                }
            }

            // Sales Staff user
            var salesEmail = "sale@accarenas.com";
            var salesUser = await userManager.FindByEmailAsync(salesEmail);
            if (salesUser == null)
            {
                salesUser = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    UserName = salesEmail,
                    Email = salesEmail,
                    EmailConfirmed = true,
                    FullName = "Tran Thi Sale",
                    CreatedAt = DateTime.UtcNow.AddDays(-15),
                    IsActive = true,
                };

                var result = await userManager.CreateAsync(salesUser, "Sale@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(salesUser, "SalesStaff");
                }
            }

            // Sales Manager user
            var salesManagerEmail = "sale.manager@accarenas.com";
            var salesManagerUser = await userManager.FindByEmailAsync(salesManagerEmail);
            if (salesManagerUser == null)
            {
                salesManagerUser = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    UserName = salesManagerEmail,
                    Email = salesManagerEmail,
                    EmailConfirmed = true,
                    FullName = "Pham Thi Sale Manager",
                    CreatedAt = DateTime.UtcNow.AddDays(-30),
                    IsActive = false, // Inactive user for testing
                };

                var result = await userManager.CreateAsync(salesManagerUser, "SaleManager@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(salesManagerUser, "SalesStaff");
                }
            }

            // Additional test user with username-only format
            var usernameOnlyEmail = "trongytb2@gmail.com";
            var usernameOnlyUser = await userManager.FindByEmailAsync(usernameOnlyEmail);
            if (usernameOnlyUser == null)
            {
                usernameOnlyUser = new ApplicationUser
                {
                    Id = Guid.NewGuid(),
                    UserName = "trongytb2",
                    Email = usernameOnlyEmail,
                    EmailConfirmed = true,
                    FullName = "Trong Do",
                    CreatedAt = DateTime.UtcNow.AddDays(-5),
                    IsActive = true,
                };

                var result = await userManager.CreateAsync(usernameOnlyUser, "Trong@123");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(usernameOnlyUser, "Customer");
                }
            }
        }
    }
}
