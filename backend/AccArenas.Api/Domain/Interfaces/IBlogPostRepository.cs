using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;

namespace AccArenas.Api.Domain.Interfaces
{
    public interface IBlogPostRepository : IRepository<BlogPost>
    {
        Task<IEnumerable<BlogPost>> GetPublishedPostsAsync();
        Task<IEnumerable<BlogPost>> GetPostsByCategoryAsync(Guid categoryId);
        Task<IEnumerable<BlogPost>> GetRecentPostsAsync(int count = 10);
    }
}
