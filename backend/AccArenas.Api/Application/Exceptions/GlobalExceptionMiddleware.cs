using System.Net;
using System.Text.Json;
using AccArenas.Api.Application.DTOs;

namespace AccArenas.Api.Application.Exceptions
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<GlobalExceptionMiddleware> _logger;

        public GlobalExceptionMiddleware(
            RequestDelegate next,
            ILogger<GlobalExceptionMiddleware> logger
        )
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
                await HandleExceptionAsync(context, ex);
            }
        }

        private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var response = exception switch
            {
                ApiException apiEx => new AuthResponse
                {
                    Success = false,
                    Message = apiEx.Message,
                    Errors = apiEx.Errors?.Values.ToList() ?? new List<string>(),
                },
                UnauthorizedAccessException => new AuthResponse
                {
                    Success = false,
                    Message = ExceptionMessages.UNAUTHORIZED,
                },
                ArgumentException argEx => new AuthResponse
                {
                    Success = false,
                    Message = ExceptionMessages.INVALID_INPUT,
                    Errors = new List<string> { argEx.Message },
                },
                KeyNotFoundException => new AuthResponse
                {
                    Success = false,
                    Message = ExceptionMessages.USER_NOT_FOUND,
                },
                _ => new AuthResponse
                {
                    Success = false,
                    Message = ExceptionMessages.INTERNAL_SERVER_ERROR,
                },
            };

            var statusCode = exception switch
            {
                ApiException apiEx => apiEx.StatusCode,
                UnauthorizedAccessException => HttpStatusCode.Unauthorized,
                ArgumentException => HttpStatusCode.BadRequest,
                KeyNotFoundException => HttpStatusCode.NotFound,
                _ => HttpStatusCode.InternalServerError,
            };

            context.Response.StatusCode = (int)statusCode;

            var jsonResponse = JsonSerializer.Serialize(
                response,
                new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
            );

            await context.Response.WriteAsync(jsonResponse);
        }
    }

    // Extension method để đăng ký middleware
    public static class GlobalExceptionMiddlewareExtensions
    {
        public static IApplicationBuilder UseGlobalExceptionHandling(
            this IApplicationBuilder builder
        )
        {
            return builder.UseMiddleware<GlobalExceptionMiddleware>();
        }
    }
}
