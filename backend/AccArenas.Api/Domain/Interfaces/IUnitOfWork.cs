using System;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface IUnitOfWork : IDisposable
    {
        // User repositories (Identity)
        IRepository<ApplicationUser> Users { get; }
        IRepository<ApplicationRole> Roles { get; }

        // Business entity repositories
        IBannerRepository Banners { get; }
        IBlogPostRepository BlogPosts { get; }
        ICategoryRepository Categories { get; }
        IFeedbackRepository Feedbacks { get; }
        IGameAccountRepository GameAccounts { get; }
        IOrderRepository Orders { get; }
        IPromotionRepository Promotions { get; }
        ISliderRepository Sliders { get; }

        // Transaction management
        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitTransactionAsync();
        Task RollbackTransactionAsync();
    }
}
