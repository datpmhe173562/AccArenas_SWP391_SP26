using System;
using System.Linq;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

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
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<ApplicationDbContext>>();
            logger.LogInformation("Database migration completed");

            // Seed roles if they don't exist
            await SeedRolesAsync(roleManager, logger);

            // Seed users
            await SeedAdminUserAsync(userManager, logger);
            await SeedTestUsersAsync(userManager, logger);

            // Seed sample data
            await SeedCategoriesAsync(context, logger);
            await SeedGameAccountsAsync(context, logger);
            await SeedPromotionsAsync(context, logger);

            logger.LogInformation("Database initialization completed successfully");
        }

        private static async Task SeedRolesAsync(
            RoleManager<ApplicationRole> roleManager,
            ILogger logger
        )
        {
            logger.LogInformation("Seeding roles...");

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
                new ApplicationRole
                {
                    Name = "Moderator",
                    Description = "Moderator managing content and user support",
                },
            };

            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role.Name!))
                {
                    await roleManager.CreateAsync(role);
                    logger.LogInformation($"Created role: {role.Name}");
                }
            }
        }

        private static async Task SeedAdminUserAsync(
            UserManager<ApplicationUser> userManager,
            ILogger logger
        )
        {
            logger.LogInformation("Seeding admin user...");

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
                    logger.LogInformation($"Created admin user: {adminEmail}");
                }
            }
        }

        private static async Task SeedTestUsersAsync(
            UserManager<ApplicationUser> userManager,
            ILogger logger
        )
        {
            logger.LogInformation("Seeding test users...");

            var testUsers = new[]
            {
                // Customers
                new
                {
                    Email = "customer1@test.com",
                    UserName = "customer1",
                    FullName = "Customer One",
                    Password = "Test@123",
                    Role = "Customer",
                },
                new
                {
                    Email = "customer2@test.com",
                    UserName = "customer2",
                    FullName = "Customer Two",
                    Password = "Test@123",
                    Role = "Customer",
                },
                new
                {
                    Email = "customer@test.com",
                    UserName = "customer",
                    FullName = "Test Customer",
                    Password = "Test@123",
                    Role = "Customer",
                },
                new
                {
                    Email = "test@test.com",
                    UserName = "test",
                    FullName = "Test User",
                    Password = "Test@123",
                    Role = "Customer",
                },
                // Sales Staff
                new
                {
                    Email = "sales@test.com",
                    UserName = "sales",
                    FullName = "Sales Staff",
                    Password = "Test@123",
                    Role = "SalesStaff",
                },
                new
                {
                    Email = "sales1@test.com",
                    UserName = "sales1",
                    FullName = "Sales Staff One",
                    Password = "Test@123",
                    Role = "SalesStaff",
                },
                // Marketing Staff
                new
                {
                    Email = "marketing@test.com",
                    UserName = "marketing",
                    FullName = "Marketing Staff",
                    Password = "Test@123",
                    Role = "MarketingStaff",
                },
                new
                {
                    Email = "marketing1@test.com",
                    UserName = "marketing1",
                    FullName = "Marketing Staff One",
                    Password = "Test@123",
                    Role = "MarketingStaff",
                },
                // Moderator
                new
                {
                    Email = "mod@test.com",
                    UserName = "moderator",
                    FullName = "Moderator User",
                    Password = "Test@123",
                    Role = "Moderator",
                },
            };

            foreach (var userData in testUsers)
            {
                var existingUser = await userManager.FindByEmailAsync(userData.Email);
                if (existingUser == null)
                {
                    var user = new ApplicationUser
                    {
                        Id = Guid.NewGuid(),
                        UserName = userData.UserName,
                        Email = userData.Email,
                        EmailConfirmed = true,
                        FullName = userData.FullName,
                        CreatedAt = DateTime.UtcNow,
                        IsActive = true,
                    };

                    var result = await userManager.CreateAsync(user, userData.Password);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(user, userData.Role);
                        logger.LogInformation(
                            $"Created test user: {userData.Email} with role {userData.Role}"
                        );
                    }
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

        private static async Task SeedCategoriesAsync(ApplicationDbContext context, ILogger logger)
        {
            if (!context.Categories.Any())
            {
                logger.LogInformation("Seeding categories...");

                var categories = new[]
                {
                    new Category
                    {
                        Id = Guid.NewGuid(),
                        Name = "League of Legends",
                        Slug = "league-of-legends",
                        IsActive = true,
                    },
                    new Category
                    {
                        Id = Guid.NewGuid(),
                        Name = "Valorant",
                        Slug = "valorant",
                        IsActive = true,
                    },
                    new Category
                    {
                        Id = Guid.NewGuid(),
                        Name = "PUBG",
                        Slug = "pubg",
                        IsActive = true,
                    },
                    new Category
                    {
                        Id = Guid.NewGuid(),
                        Name = "Mobile Legends",
                        Slug = "mobile-legends",
                        IsActive = true,
                    },
                    new Category
                    {
                        Id = Guid.NewGuid(),
                        Name = "Liên Quân Mobile",
                        Slug = "lien-quan-mobile",
                        IsActive = true,
                    },
                };

                await context.Categories.AddRangeAsync(categories);
                await context.SaveChangesAsync();
                logger.LogInformation($"Created {categories.Length} categories");
            }
        }

        private static async Task SeedGameAccountsAsync(
            ApplicationDbContext context,
            ILogger logger
        )
        {
            if (!context.GameAccounts.Any())
            {
                logger.LogInformation("Seeding game accounts...");

                var lolCategory = await context.Categories.FirstOrDefaultAsync(c =>
                    c.Slug == "league-of-legends"
                );
                var valorantCategory = await context.Categories.FirstOrDefaultAsync(c =>
                    c.Slug == "valorant"
                );
                var pubgCategory = await context.Categories.FirstOrDefaultAsync(c =>
                    c.Slug == "pubg"
                );

                if (lolCategory != null && valorantCategory != null && pubgCategory != null)
                {
                    var gameAccounts = new[]
                    {
                        // League of Legends accounts
                        new GameAccount
                        {
                            Id = Guid.NewGuid(),
                            Game = "League of Legends",
                            AccountName = "LOL_Diamond_001",
                            Password = "Diamond123@",
                            Rank = "Diamond IV",
                            Price = 1500000,
                            Currency = "VND",
                            IsAvailable = true,
                            CategoryId = lolCategory.Id,
                            CreatedAt = DateTime.UtcNow,
                        },
                        new GameAccount
                        {
                            Id = Guid.NewGuid(),
                            Game = "League of Legends",
                            AccountName = "LOL_Platinum_002",
                            Password = "Platinum456!",
                            Rank = "Platinum II",
                            Price = 900000,
                            Currency = "VND",
                            IsAvailable = true,
                            CategoryId = lolCategory.Id,
                            CreatedAt = DateTime.UtcNow,
                        },
                        new GameAccount
                        {
                            Id = Guid.NewGuid(),
                            Game = "League of Legends",
                            AccountName = "LOL_Gold_003",
                            Password = "Gold789#",
                            Rank = "Gold I",
                            Price = 500000,
                            Currency = "VND",
                            IsAvailable = true,
                            CategoryId = lolCategory.Id,
                            CreatedAt = DateTime.UtcNow,
                        },
                        // Valorant accounts
                        new GameAccount
                        {
                            Id = Guid.NewGuid(),
                            Game = "Valorant",
                            AccountName = "VAL_Immortal_001",
                            Password = "Immortal999$",
                            Rank = "Immortal 1",
                            Price = 2500000,
                            Currency = "VND",
                            IsAvailable = true,
                            CategoryId = valorantCategory.Id,
                            CreatedAt = DateTime.UtcNow,
                        },
                        new GameAccount
                        {
                            Id = Guid.NewGuid(),
                            Game = "Valorant",
                            AccountName = "VAL_Diamond_002",
                            Password = "ValDiamond777%",
                            Rank = "Diamond 3",
                            Price = 1200000,
                            Currency = "VND",
                            IsAvailable = true,
                            CategoryId = valorantCategory.Id,
                            CreatedAt = DateTime.UtcNow,
                        },
                        // PUBG accounts
                        new GameAccount
                        {
                            Id = Guid.NewGuid(),
                            Game = "PUBG",
                            AccountName = "PUBG_Conqueror_001",
                            Password = "Conqueror555&",
                            Rank = "Conqueror",
                            Price = 3000000,
                            Currency = "VND",
                            IsAvailable = true,
                            CategoryId = pubgCategory.Id,
                            CreatedAt = DateTime.UtcNow,
                        },
                        new GameAccount
                        {
                            Id = Guid.NewGuid(),
                            Game = "PUBG",
                            AccountName = "PUBG_Ace_002",
                            Password = "PubgAce333*",
                            Rank = "Ace",
                            Price = 1800000,
                            Currency = "VND",
                            IsAvailable = false, // Sold account
                            CategoryId = pubgCategory.Id,
                            CreatedAt = DateTime.UtcNow,
                        },
                    };

                    await context.GameAccounts.AddRangeAsync(gameAccounts);
                    await context.SaveChangesAsync();
                    logger.LogInformation($"Created {gameAccounts.Length} game accounts");
                }
            }
        }

        private static async Task SeedPromotionsAsync(ApplicationDbContext context, ILogger logger)
        {
            if (!context.Promotions.Any())
            {
                logger.LogInformation("Seeding promotions...");

                var promotions = new[]
                {
                    new Promotion
                    {
                        Id = Guid.NewGuid(),
                        Code = "WELCOME10",
                        Description = "10% discount for new customers",
                        DiscountPercent = 10,
                        StartDate = DateTime.UtcNow,
                        EndDate = DateTime.UtcNow.AddMonths(3),
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                    },
                    new Promotion
                    {
                        Id = Guid.NewGuid(),
                        Code = "SUMMER25",
                        Description = "25% summer sale discount",
                        DiscountPercent = 25,
                        StartDate = DateTime.UtcNow,
                        EndDate = DateTime.UtcNow.AddMonths(1),
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                    },
                    new Promotion
                    {
                        Id = Guid.NewGuid(),
                        Code = "VIP50",
                        Description = "50% VIP customer discount",
                        DiscountPercent = 50,
                        StartDate = DateTime.UtcNow,
                        EndDate = DateTime.UtcNow.AddMonths(6),
                        IsActive = true,
                        CreatedAt = DateTime.UtcNow,
                    },
                    new Promotion
                    {
                        Id = Guid.NewGuid(),
                        Code = "EXPIRED20",
                        Description = "Expired promotion - 20% off",
                        DiscountPercent = 20,
                        StartDate = DateTime.UtcNow.AddMonths(-2),
                        EndDate = DateTime.UtcNow.AddDays(-1),
                        IsActive = false,
                        CreatedAt = DateTime.UtcNow.AddMonths(-2),
                    },
                };

                await context.Promotions.AddRangeAsync(promotions);
                await context.SaveChangesAsync();
                logger.LogInformation($"Created {promotions.Length} promotions");
            }
        }
    }
}
