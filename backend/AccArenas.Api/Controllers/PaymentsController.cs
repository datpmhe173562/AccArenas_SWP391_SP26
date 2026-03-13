using System;
using System.Linq;
using System.Threading.Tasks;
using AccArenas.Api.Application.Services;
using AccArenas.Api.Domain.Interfaces;
using AccArenas.Api.Domain.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AccArenas.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IEmailService _emailService;

        public PaymentsController(
            IVnPayService vnPayService,
            IUnitOfWork unitOfWork,
            IEmailService emailService
        )
        {
            _vnPayService = vnPayService;
            _unitOfWork = unitOfWork;
            _emailService = emailService;
        }

        [HttpGet("vnpay-return")]
        public async Task<IActionResult> PaymentReturn()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);

            if (Guid.TryParse(response.OrderId, out var orderIdGuid))
            {
                // Refetch order with Items and GameAccounts for processing and email
                var order = await _unitOfWork.Orders.GetOrderByIdWithItemsAsync(orderIdGuid);

                if (order != null && order.Status.Equals("Pending", StringComparison.OrdinalIgnoreCase))
                {
                    if (response.Success)
                    {
                        order.Status = "Paid";
                        _unitOfWork.Orders.Update(order);
                        await _unitOfWork.SaveChangesAsync();

                        var user = await _unitOfWork.Users.GetByIdAsync(order.UserId);
                        if (user != null)
                        {
                            await SendOrderSuccessEmail(user, order);
                        }
                    }
                    else
                    {
                        order.Status = "Cancelled"; // Use "Cancelled" for Consistency with UI
                        _unitOfWork.Orders.Update(order);

                        // Unlock the game accounts so others can buy them
                        foreach (var item in order.Items)
                        {
                            var acc = await _unitOfWork.GameAccounts.GetByIdAsync(item.GameAccountId);
                            if (acc != null)
                            {
                                acc.IsAvailable = true;
                                _unitOfWork.GameAccounts.Update(acc);
                            }
                        }
                        await _unitOfWork.SaveChangesAsync();
                    }
                }
            }

            // Return URL configuration for frontend
            var frontendUrl = "http://localhost:3000/payment/result";
            var successParam = response.Success ? "true" : "false";
            return Redirect(
                $"{frontendUrl}?success={successParam}&orderId={response.OrderId}&vnp_ResponseCode={response.VnPayResponseCode}"
            );
        }

        private async Task SendOrderSuccessEmail(ApplicationUser user, Order order)
        {
            var itemsListHtml = string.Join("<br/>", order.Items.Select(item => 
                $"<li><strong>Game:</strong> {item.GameAccount?.Game} - <strong>Tài khoản:</strong> <code style='background:#eee;padding:2px 5px;'>{item.GameAccount?.AccountName}</code> - <strong>Mật khẩu:</strong> <code style='background:#eee;padding:2px 5px;'>{item.GameAccount?.Password}</code></li>"
            ));

            var body = $@"
                <html>
                <body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>
                    <div style='max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden;'>
                        <div style='background: #4f46e5; color: white; padding: 20px; text-align: center;'>
                            <h2 style='margin: 0;'>Thanh toán thành công!</h2>
                        </div>
                        <div style='padding: 30px;'>
                            <p>Chào <strong>{user.FullName ?? user.UserName}</strong>,</p>
                            <p>Cảm ơn bạn đã tin tưởng AccArenas. Đơn hàng <strong>#{order.Id.ToString().Split('-')[0].ToUpper()}</strong> đã được thanh toán.</p>
                            <p>Dưới đây là thông tin đăng nhập các tài khoản bạn đã mua:</p>
                            <ul style='background: #f9fafb; padding: 15px 20px; border-radius: 8px; list-style: none; margin: 20px 0;'>
                                {itemsListHtml}
                            </ul>
                            <p style='color: #ef4444; font-weight: bold;'>⚠️ Lưu ý: Vui lòng đổi mật khẩu ngay sau khi đăng nhập để đảm bảo quyền sở hữu.</p>
                            <div style='margin-top: 30px; border-top: 1px solid #eee; pt: 20px; font-size: 0.9em; color: #666;'>
                                <p>Nếu gặp vấn đề, vui lòng liên hệ hỗ trợ hoặc tạo Ticket trên website.</p>
                                <p>Trân trọng,<br/>Đội ngũ AccArenas</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>";

            await _emailService.SendEmailAsync(
                user.Email!,
                "Xác nhận thanh toán đơn hàng - AccArenas",
                body
            );
        }
    }
}
