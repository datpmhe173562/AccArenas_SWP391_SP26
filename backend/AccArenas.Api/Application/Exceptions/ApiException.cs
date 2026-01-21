using System.Net;

namespace AccArenas.Api.Application.Exceptions
{
    public class ApiException(
        string message,
        HttpStatusCode statusCode = HttpStatusCode.InternalServerError,
        Dictionary<string, string>? errors = null
    ) : Exception(message)
    {
        public HttpStatusCode StatusCode { get; set; } = statusCode;
        public Dictionary<string, string>? Errors { get; set; } = errors;
    }
}
