using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using AccArenas.Api.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AccArenas.Api.Infrastructure.Repositories
{
    public class BlogPostRepository : Repository<BlogPost>, IBlogPostRepository
    {
        public BlogPostRepository(ApplicationDbContext context)
            : base(context) { }

        public async Task<IEnumerable<BlogPost>> GetPublishedPostsAsync()
        {
            return await _dbSet
                .Where(b => b.IsPublished)
                .OrderByDescending(b => b.PublishedAt ?? b.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<BlogPost>> GetPostsByCategoryAsync(Guid categoryId)
        {
            return await _dbSet
                .Where(b => b.CategoryId == categoryId && b.IsPublished)
                .OrderByDescending(b => b.PublishedAt ?? b.CreatedAt)
                .ToListAsync();
        }

        public async Task<IEnumerable<BlogPost>> GetRecentPostsAsync(int count = 10)
        {
            return await _dbSet
                .Where(b => b.IsPublished)
                .OrderByDescending(b => b.PublishedAt ?? b.CreatedAt)
                .Take(count)
                .ToListAsync();
        }
    }
}
