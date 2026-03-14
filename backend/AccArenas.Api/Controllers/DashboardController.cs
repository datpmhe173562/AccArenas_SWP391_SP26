using System.Threading.Tasks;
using AccArenas.Api.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AccArenas.Api.Infrastructure.Data;
using AccArenas.Api.Application.DTOs;

namespace AccArenas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(AuthenticationSchemes = Microsoft.AspNetCore.Authentication.JwtBearer.JwtBearerDefaults.AuthenticationScheme)]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;

        public DashboardController(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpGet("stats")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetDashboardStats()
        {
            var totalUsers = await _userManager.Users.CountAsync();
            var totalProducts = await _context.GameAccounts.CountAsync();
            var totalOrders = await _context.Orders.CountAsync();
            
            // Total Revenue from completed/paid/processing/delivered orders
            var successfulStatuses = new[] { "Completed", "Paid", "Processing", "Delivered" };
            var totalRevenue = await _context.Orders
                .Where(o => successfulStatuses.Contains(o.Status))
                .SumAsync(o => o.TotalAmount);

            return Ok(new
            {
                TotalUsers = totalUsers,
                TotalProducts = totalProducts,
                TotalOrders = totalOrders,
                TotalRevenue = totalRevenue
            });
        }

        [HttpGet("marketer/stats")]
        [Authorize(Roles = "Admin,MarketingStaff")]
        public async Task<IActionResult> GetMarketerDashboardStats()
        {
            var totalProducts = await _context.GameAccounts.CountAsync();
            var totalCategories = await _context.Categories.CountAsync();
            
            // Only count active promotions
            var totalVouchers = await _context.Promotions
                .Where(p => p.IsActive)
                .CountAsync();

            return Ok(new
            {
                TotalProducts = totalProducts,
                TotalCategories = totalCategories,
                TotalVouchers = totalVouchers
            });
        }

        [HttpGet("marketer/category-distribution")]
        [Authorize(Roles = "Admin,MarketingStaff")]
        public async Task<IActionResult> GetCategoryDistribution()
        {
            var distribution = await _context.Categories
                .Select(c => new
                {
                    Name = c.Name,
                    Count = _context.GameAccounts.Count(ga => ga.CategoryId == c.Id)
                })
                .ToListAsync();

            return Ok(distribution);
        }

        [HttpGet("admin/charts")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAdminCharts()
        {
            var thirtyDaysAgo = DateTime.UtcNow.Date.AddDays(-30);

            // Revenue growth
            var successfulStatuses = new[] { "Completed", "Paid", "Processing", "Delivered" };
            var orders = await _context.Orders
                .Where(o => successfulStatuses.Contains(o.Status) && o.CreatedAt >= thirtyDaysAgo)
                .Select(o => new { o.CreatedAt, o.TotalAmount })
                .ToListAsync();

            var revenueGrowth = Enumerable.Range(0, 31)
                .Select(i => thirtyDaysAgo.AddDays(i))
                .Select(date => new
                {
                    Date = date.ToString("yyyy-MM-dd"),
                    Revenue = orders.Where(o => o.CreatedAt.Date == date).Sum(o => o.TotalAmount)
                });

            // User growth
            var users = await _userManager.Users
                .Where(u => u.CreatedAt >= thirtyDaysAgo)
                .Select(u => u.CreatedAt)
                .ToListAsync();

            var userGrowth = Enumerable.Range(0, 31)
                .Select(i => thirtyDaysAgo.AddDays(i))
                .Select(date => new
                {
                    Date = date.ToString("yyyy-MM-dd"),
                    Count = users.Count(u => u.Date == date)
                });

            return Ok(new
            {
                RevenueGrowth = revenueGrowth,
                UserGrowth = userGrowth
            });
        }

        [HttpGet("marketer/revenue-chart")]
        [Authorize(Roles = "Admin,MarketingStaff")]
        public async Task<IActionResult> GetMarketerRevenueChart([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
        {
            // Default to current month if dates are not provided
            var start = startDate ?? new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
            var end = endDate ?? start.AddMonths(1).AddDays(-1);

            // Fetch successful orders within the date range
            var successfulStatuses = new[] { "Completed", "Paid", "Processing", "Delivered" };
            var orders = await _context.Orders
                .Where(o => successfulStatuses.Contains(o.Status) && o.CreatedAt >= start && o.CreatedAt <= end)
                .Select(o => new { o.CreatedAt, o.TotalAmount })
                .ToListAsync();

            // Aggregate revenue by Date
            var dailyRevenue = orders
                .GroupBy(o => o.CreatedAt.Date)
                .Select(g => new
                {
                    Date = g.Key.ToString("yyyy-MM-dd"), // Format date as string for client consumption
                    Revenue = g.Sum(o => o.TotalAmount)
                })
                .OrderBy(x => x.Date)
                .ToList();

            // Fill in missing days with 0 revenue to ensure the chart looks continuous
            var chartData = new List<object>();
            for (var date = start.Date; date <= end.Date; date = date.AddDays(1))
            {
                var dateStr = date.ToString("yyyy-MM-dd");
                var dayData = dailyRevenue.FirstOrDefault(d => d.Date == dateStr);
                
                chartData.Add(new
                {
                    Date = dateStr,
                    Revenue = dayData?.Revenue ?? 0
                });
            }

            return Ok(chartData);
        }
    }
}
