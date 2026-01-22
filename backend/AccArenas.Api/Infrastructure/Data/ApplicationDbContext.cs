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
        public DbSet<Promotion> Promotions => Set<Promotion>();
        public DbSet<BlogPost> BlogPosts => Set<BlogPost>();
        public DbSet<Banner> Banners => Set<Banner>();
        public DbSet<Slider> Sliders => Set<Slider>();
        public DbSet<Category> Categories => Set<Category>();
        public DbSet<Feedback> Feedbacks => Set<Feedback>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

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
