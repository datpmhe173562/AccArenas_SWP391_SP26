namespace AccArenas.Api.Domain.Interfaces
{
    public interface IEmailService
    {
        Task SendEmailAsync(string toEmail, string subject, string body);
        Task SendPasswordResetEmailAsync(string toEmail, string userName, string newPassword);
    }
}
