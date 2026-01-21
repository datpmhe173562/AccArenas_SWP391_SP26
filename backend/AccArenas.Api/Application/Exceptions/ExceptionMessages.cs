using System.Net;

namespace AccArenas.Api.Application.Exceptions
{
    public static class ExceptionMessages
    {
        // Authentication & Authorization
        public const string INVALID_CREDENTIALS = "Tên đăng nhập hoặc mật khẩu không đúng";
        public const string EMAIL_NOT_FOUND = "Email không tồn tại trong hệ thống";
        public const string USER_NOT_FOUND = "Không tìm thấy người dùng";
        public const string USER_INACTIVE = "Tài khoản đã bị vô hiệu hóa";
        public const string EMAIL_ALREADY_EXISTS = "Email đã được sử dụng";
        public const string USERNAME_ALREADY_EXISTS = "Tên đăng nhập đã được sử dụng";
        public const string REGISTRATION_FAILED = "Đăng ký tài khoản không thành công";
        public const string LOGIN_FAILED = "Đăng nhập không thành công";
        public const string LOGOUT_FAILED = "Đăng xuất không thành công";

        // Token Related
        public const string INVALID_TOKEN = "Token không hợp lệ";
        public const string EXPIRED_TOKEN = "Token đã hết hạn";
        public const string INVALID_REFRESH_TOKEN = "Refresh token không hợp lệ hoặc đã hết hạn";
        public const string TOKEN_REFRESH_FAILED = "Làm mới token không thành công";
        public const string TOKEN_REVOCATION_FAILED = "Thu hồi token không thành công";

        // Password Related
        public const string INVALID_CURRENT_PASSWORD = "Mật khẩu hiện tại không đúng";
        public const string PASSWORD_CHANGE_FAILED = "Đổi mật khẩu không thành công";
        public const string PASSWORD_RESET_TOKEN_INVALID =
            "Mã reset mật khẩu không hợp lệ hoặc đã hết hạn";
        public const string PASSWORD_RESET_FAILED = "Reset mật khẩu không thành công";
        public const string SEND_RESET_EMAIL_FAILED = "Gửi email reset mật khẩu không thành công";

        // Validation
        public const string INVALID_INPUT = "Dữ liệu không hợp lệ";
        public const string MISSING_REQUIRED_FIELDS = "Thiếu thông tin bắt buộc";
        public const string INVALID_EMAIL_FORMAT = "Định dạng email không hợp lệ";
        public const string PASSWORD_TOO_WEAK =
            "Mật khẩu quá yếu. Cần ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số";

        // Server Errors
        public const string INTERNAL_SERVER_ERROR = "Có lỗi xảy ra trong hệ thống";
        public const string DATABASE_CONNECTION_ERROR = "Không thể kết nối cơ sở dữ liệu";
        public const string EMAIL_SERVICE_ERROR = "Dịch vụ email không khả dụng";

        // Access Control
        public const string UNAUTHORIZED = "Bạn không có quyền truy cập";
        public const string FORBIDDEN = "Bạn không có quyền thực hiện hành động này";
        public const string ACCESS_DENIED = "Truy cập bị từ chối";

        // Success Messages
        public const string REGISTRATION_SUCCESS = "Đăng ký tài khoản thành công";
        public const string LOGIN_SUCCESS = "Đăng nhập thành công";
        public const string LOGOUT_SUCCESS = "Đăng xuất thành công";
        public const string PASSWORD_CHANGED_SUCCESS = "Đổi mật khẩu thành công";
        public const string PASSWORD_RESET_EMAIL_SENT = "Email reset mật khẩu đã được gửi";
        public const string PASSWORD_RESET_SUCCESS = "Reset mật khẩu thành công";
        public const string TOKEN_REFRESHED_SUCCESS = "Token đã được làm mới thành công";
        public const string TOKEN_REVOKED_SUCCESS = "Token đã được thu hồi thành công";

        // Helper methods to create exceptions with specific status codes
        public static ApiException BadRequest(
            string message,
            Dictionary<string, string>? errors = null
        ) => new(message, HttpStatusCode.BadRequest, errors);

        public static ApiException Unauthorized(string message = UNAUTHORIZED) =>
            new(message, HttpStatusCode.Unauthorized);

        public static ApiException Forbidden(string message = FORBIDDEN) =>
            new(message, HttpStatusCode.Forbidden);

        public static ApiException NotFound(string message = USER_NOT_FOUND) =>
            new(message, HttpStatusCode.NotFound);

        public static ApiException InternalServerError(string message = INTERNAL_SERVER_ERROR) =>
            new(message, HttpStatusCode.InternalServerError);
    }
}
