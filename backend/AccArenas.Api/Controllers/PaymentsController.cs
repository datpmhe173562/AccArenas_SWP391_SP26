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
            IEmailService emailService)
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
                var order = await _unitOfWork.Orders.GetByIdAsync(orderIdGuid);
                
                if (order != null)
                {
                    // Include User & Items manually or through query if Repo allows
                    // Wait, we need the Game Accounts to send in the email.
                    // For now, let's just mark it as Paid/Failed based on response
                    
                    if (response.Success)
                    {
                        if (order.Status == "Pending")
                        {
                            order.Status = "Paid";
                            _unitOfWork.Orders.Update(order);
                            await _unitOfWork.SaveChangesAsync();

                            // Refetch with User and Items tracking for Email (if possible in standard repo)
                            // Or we simply lookup the User to send the email
                            var user = await _unitOfWork.Users.GetByIdAsync(order.UserId);
                            if (user != null)
                            {
                                await SendOrderSuccessEmail(user, order);
                            }
                        }
                    }
                    else
                    {
                        if (order.Status == "Pending")
                        {
                            order.Status = "Failed";
                            _unitOfWork.Orders.Update(order);
                            
                            // Unlock the game accounts
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
            }

            // Return URL configuration for frontend
            var frontendUrl = "http://localhost:3000/payment/result";
            var successParam = response.Success ? "true" : "false";
            return Redirect($"{frontendUrl}?success={successParam}&orderId={response.OrderId}&vnp_ResponseCode={response.VnPayResponseCode}");
        }

        private async Task SendOrderSuccessEmail(ApplicationUser user, Order order)
        {
            // Build the body with bought accounts details
            var body = $@"
                <html>
                <body>
                    <h2>Cảm ơn bạn đã mua hàng tại AccArenas!</h2>
                    <p>Chào {user.FullName ?? user.UserName},</p>
                    <p>Đơn hàng <strong>#{order.Id.ToString().Split('-')[0]}</strong> của bạn đã được thanh toán thành công.</p>
                    <p>Chi tiết tài khoản sẽ được hiển thị trong phần 'Lịch sử đơn hàng' trên website, hoặc xem thông tin chi tiết dưới đây:</p>
                    <p>(Mock Data: Tài khoản và mật khẩu của các game sẽ hiển thị tại đây)</p>
                    <br>
                    <p>Trân trọng,</p>
                    <p>Đội ngũ AccArenas</p>
                </body>
                </html>
            ";

            await _emailService.SendEmailAsync(user.Email!, "Xác nhận thanh toán đơn hàng - AccArenas", body);
        }
    }
}
