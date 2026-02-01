using System.Net;
using System.Net.Mail;
using AccArenas.Api.Domain.Interfaces;
using Microsoft.Extensions.Configuration;

namespace AccArenas.Api.Application.Services
{
    public class EmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task SendEmailAsync(string toEmail, string subject, string body)
        {
            try
            {
                var smtpHost = _configuration["EmailSettings:SmtpHost"];
                var smtpPort = int.Parse(_configuration["EmailSettings:SmtpPort"] ?? "587");
                var smtpUser = _configuration["EmailSettings:SmtpUser"];
                var smtpPassword = _configuration["EmailSettings:SmtpPassword"];
                var fromEmail = _configuration["EmailSettings:FromEmail"];
                var fromName = _configuration["EmailSettings:FromName"];

                if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUser))
                {
                    _logger.LogWarning("Email configuration is missing. Email not sent.");
                    return;
                }

                using var smtpClient = new SmtpClient(smtpHost, smtpPort)
                {
                    EnableSsl = true,
                    Credentials = new NetworkCredential(smtpUser, smtpPassword),
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(fromEmail ?? smtpUser, fromName ?? "AccArenas"),
                    Subject = subject,
                    Body = body,
                    IsBodyHtml = true,
                };

                mailMessage.To.Add(toEmail);

                await smtpClient.SendMailAsync(mailMessage);
                _logger.LogInformation($"Email sent successfully to {toEmail}");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to send email to {toEmail}");
                throw;
            }
        }

        public async Task SendPasswordResetEmailAsync(
            string toEmail,
            string userName,
            string newPassword
        )
        {
            var subject = "Đặt lại mật khẩu - AccArenas";
            var body =
                $@"
                <html>
                <head>
                    <style>
                        body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
                        .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
                        .header {{ background-color: #4F46E5; color: white; padding: 20px; text-align: center; }}
                        .content {{ background-color: #f9f9f9; padding: 30px; border-radius: 5px; margin-top: 20px; }}
                        .password-box {{ background-color: #fff; padding: 15px; border: 2px solid #4F46E5; border-radius: 5px; font-size: 18px; font-weight: bold; text-align: center; margin: 20px 0; }}
                        .footer {{ margin-top: 30px; text-align: center; color: #666; font-size: 12px; }}
                    </style>
                </head>
                <body>
                    <div class='container'>
                        <div class='header'>
                            <h1>AccArenas</h1>
                        </div>
                        <div class='content'>
                            <h2>Xin chào {userName},</h2>
                            <p>Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
                            <p>Mật khẩu mới của bạn là:</p>
                            <div class='password-box'>
                                {newPassword}
                            </div>
                            <p><strong>Lưu ý:</strong> Vui lòng đăng nhập và thay đổi mật khẩu này ngay sau khi đăng nhập thành công để đảm bảo an toàn cho tài khoản của bạn.</p>
                            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng liên hệ với chúng tôi ngay lập tức.</p>
                        </div>
                        <div class='footer'>
                            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
                            <p>&copy; 2026 AccArenas. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            ";

            await SendEmailAsync(toEmail, subject, body);
        }
    }
}
