using System;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using AccArenas.Api.Infrastructure.Data;
using AccArenas.Api.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore.Storage;

namespace AccArenas.Api.Infrastructure.Repositories
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        private IDbContextTransaction? _transaction;

        // User repositories (Identity) - Lazy initialization
        private IRepository<ApplicationUser>? _users;
        private IRepository<ApplicationRole>? _roles;

        // Business entity repositories - Lazy initialization
        private IBannerRepository? _banners;
        private IBlogPostRepository? _blogPosts;
        private ICategoryRepository? _categories;
        private IFeedbackRepository? _feedbacks;
        private IGameAccountRepository? _gameAccounts;
        private IOrderRepository? _orders;
        private IPromotionRepository? _promotions;
        private ISliderRepository? _sliders;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
        }

        // User repositories properties
        public IRepository<ApplicationUser> Users =>
            _users ??= new Repository<ApplicationUser>(_context);

        public IRepository<ApplicationRole> Roles =>
            _roles ??= new Repository<ApplicationRole>(_context);

        // Business entity repositories properties
        public IBannerRepository Banners => _banners ??= new BannerRepository(_context);

        public IBlogPostRepository BlogPosts => _blogPosts ??= new BlogPostRepository(_context);

        public ICategoryRepository Categories => _categories ??= new CategoryRepository(_context);

        public IFeedbackRepository Feedbacks => _feedbacks ??= new FeedbackRepository(_context);

        public IGameAccountRepository GameAccounts =>
            _gameAccounts ??= new GameAccountRepository(_context);

        public IOrderRepository Orders => _orders ??= new OrderRepository(_context);

        public IPromotionRepository Promotions => _promotions ??= new PromotionRepository(_context);

        public ISliderRepository Sliders => _sliders ??= new SliderRepository(_context);

        // Transaction management
        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitTransactionAsync()
        {
            try
            {
                await _context.SaveChangesAsync();

                if (_transaction != null)
                {
                    await _transaction.CommitAsync();
                }
            }
            catch
            {
                await RollbackTransactionAsync();
                throw;
            }
            finally
            {
                if (_transaction != null)
                {
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
            }
        }

        public async Task RollbackTransactionAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
