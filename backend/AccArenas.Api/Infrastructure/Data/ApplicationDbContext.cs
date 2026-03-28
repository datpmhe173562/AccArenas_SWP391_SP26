using System;
using AccArenas.Api.Domain.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace AccArenas.Api.Infrastructure.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser, ApplicationRole, Guid>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<GameAccount> GameAccounts => Set<GameAccount>();
        public DbSet<Order> Orders => Set<Order>();
        public DbSet<OrderItem> OrderItems => Set<OrderItem>();
        public DbSet<FulfillmentEvent> FulfillmentEvents => Set<FulfillmentEvent>();
        public DbSet<Inquiry> Inquiries => Set<Inquiry>();
        public DbSet<InquiryMessage> InquiryMessages => Set<InquiryMessage>();
        public DbSet<Promotion> Promotions => Set<Promotion>();
        public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
        public DbSet<Banner> Banners => Set<Banner>();
        public DbSet<Slider> Sliders => Set<Slider>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Feedback> Feedbacks => Set<Feedback>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
        public DbSet<Favorite> Favorites => Set<Favorite>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder
                .Entity<Favorite>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<Favorite>()
                .HasOne(f => f.GameAccount)
                .WithMany()
                .HasForeignKey(f => f.GameAccountId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<AuditLog>()
                .HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<OrderItem>()
                .HasOne(oi => oi.Order)
                .WithMany(o => o.Items)
                .HasForeignKey(oi => oi.OrderId);

            builder
                .Entity<GameAccount>()
                .HasOne(ga => ga.Category)
                .WithMany()
                .HasForeignKey(ga => ga.CategoryId);

            builder
                .Entity<GameAccount>()
                .Property(p => p.Images)
                .HasConversion(
                    v =>
                        System.Text.Json.JsonSerializer.Serialize(
                            v,
                            (System.Text.Json.JsonSerializerOptions?)null
                        ),
                    v =>
                        System.Text.Json.JsonSerializer.Deserialize<List<string>>(
                            v,
                            (System.Text.Json.JsonSerializerOptions?)null
                        )
                        ?? new List<string>()
                );

            builder.Entity<GameAccount>().Property(p => p.Price).HasColumnType("decimal(18,2)");

            builder
                .Entity<Feedback>()
                .HasOne(f => f.User)
                .WithMany()
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<Feedback>()
                .HasOne(f => f.Order)
                .WithMany()
                .HasForeignKey(f => f.OrderId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<GameAccount>().Property(p => p.Price).HasColumnType("decimal(18,2)");

            builder.Entity<Order>().Property(p => p.TotalAmount).HasColumnType("decimal(18,2)");

            builder
                .Entity<Order>()
                .HasMany(o => o.FulfillmentEvents)
                .WithOne(fe => fe.Order!)
                .HasForeignKey(fe => fe.OrderId);

            builder
                .Entity<Order>()
                .HasOne(o => o.AssignedSales)
                .WithMany()
                .HasForeignKey(o => o.AssignedToSalesId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<FulfillmentEvent>()
                .HasOne(fe => fe.CreatedBy)
                .WithMany()
                .HasForeignKey(fe => fe.CreatedByUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<Inquiry>()
                .HasOne(i => i.Order)
                .WithMany()
                .HasForeignKey(i => i.OrderId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<Inquiry>()
                .HasOne(i => i.Customer)
                .WithMany()
                .HasForeignKey(i => i.CustomerUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder
                .Entity<InquiryMessage>()
                .HasOne(im => im.Inquiry)
                .WithMany(i => i.Messages)
                .HasForeignKey(im => im.InquiryId)
                .OnDelete(DeleteBehavior.Cascade);

            builder
                .Entity<InquiryMessage>()
                .HasOne(im => im.Sender)
                .WithMany()
                .HasForeignKey(im => im.SenderUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.Entity<OrderItem>().Property(p => p.Price).HasColumnType("decimal(18,2)");

            builder
                .Entity<Promotion>()
                .Property(p => p.DiscountPercent)
                .HasColumnType("decimal(5,2)");

            builder.Entity<Order>().Property(p => p.TotalAmount).HasColumnType("decimal(18,2)");

            builder.Entity<OrderItem>().Property(p => p.Price).HasColumnType("decimal(18,2)");

            builder
                .Entity<Promotion>()
                .Property(p => p.DiscountPercent)
                .HasColumnType("decimal(5,2)");
        }
    }
}
