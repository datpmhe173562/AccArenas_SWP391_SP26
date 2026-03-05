using System.Net;
using System.Security.Cryptography;
using System.Text;
using AccArenas.Api.Application.DTOs;
using Microsoft.AspNetCore.Http;

namespace AccArenas.Api.Application.Services
{
    public interface IVnPayService
    {
        string CreatePaymentUrl(HttpContext context, PaymentInformationRequest model);
        PaymentResponse PaymentExecute(IQueryCollection collections);
    }

    public class VnPayService : IVnPayService
    {
        private readonly IConfiguration _configuration;

        public VnPayService(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        public string CreatePaymentUrl(HttpContext context, PaymentInformationRequest model)
        {
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById("SE Asia Standard Time");
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = DateTime.Now.Ticks.ToString();

            var vnp_TmnCode = _configuration["VnPay:TmnCode"];
            var vnp_HashSecret = _configuration["VnPay:HashSecret"];
            var vnp_Url = _configuration["VnPay:BaseUrl"];
            var vnp_Returnurl = _configuration["VnPay:ReturnUrl"];

            var requestData = new SortedList<string, string>(new VnPayCompare());
            requestData.Add("vnp_Version", "2.1.0");
            requestData.Add("vnp_Command", "pay");
            requestData.Add("vnp_TmnCode", vnp_TmnCode!);
            requestData.Add("vnp_Amount", (model.Amount * 100).ToString());
            requestData.Add("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            requestData.Add("vnp_CurrCode", "VND");
            requestData.Add("vnp_IpAddr", GetIpAddress(context));
            requestData.Add("vnp_Locale", "vn");
            requestData.Add("vnp_OrderInfo", $"Thanh toan don hang {model.OrderId}");
            requestData.Add("vnp_OrderType", "other"); // default
            requestData.Add("vnp_ReturnUrl", vnp_Returnurl!);
            requestData.Add("vnp_TxnRef", $"{model.OrderId}_{tick}");

            var rawData = string.Join("&", requestData.Select(kvp => $"{kvp.Key}={WebUtility.UrlEncode(kvp.Value)}"));
            var vnp_SecureHash = HmacSHA512(vnp_HashSecret!, rawData);
            
            return $"{vnp_Url}?{rawData}&vnp_SecureHash={vnp_SecureHash}";
        }

        public PaymentResponse PaymentExecute(IQueryCollection collections)
        {
            var responseData = new SortedList<string, string>(new VnPayCompare());
            var vnp_SecureHash = string.Empty;
            
            foreach (var (key, value) in collections)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    if (key == "vnp_SecureHash")
                    {
                        vnp_SecureHash = value.ToString();
                    }
                    else if (key != "vnp_SecureHashType")
                    {
                        responseData.Add(key, value.ToString());
                    }
                }
            }

            var orderId = responseData.ContainsKey("vnp_TxnRef") ? responseData["vnp_TxnRef"] : string.Empty;
            var vnp_ResponseCode = responseData.ContainsKey("vnp_ResponseCode") ? responseData["vnp_ResponseCode"] : string.Empty;
            var vnp_TransactionId = responseData.ContainsKey("vnp_TransactionNo") ? responseData["vnp_TransactionNo"] : string.Empty;

            var vnp_HashSecret = _configuration["VnPay:HashSecret"];
            var rawData = string.Join("&", responseData.Select(kvp => $"{kvp.Key}={WebUtility.UrlEncode(kvp.Value)}"));
            var checkSignature = HmacSHA512(vnp_HashSecret!, rawData);
            
            bool isSuccess = checkSignature == vnp_SecureHash && vnp_ResponseCode == "00";

            return new PaymentResponse
            {
                Success = isSuccess,
                PaymentMethod = "VnPay",
                OrderDescription = responseData.ContainsKey("vnp_OrderInfo") ? responseData["vnp_OrderInfo"] : string.Empty,
                OrderId = orderId.Split('_')[0], // Extract original orderId without tick
                TransactionId = vnp_TransactionId,
                Token = vnp_SecureHash,
                VnPayResponseCode = vnp_ResponseCode
            };
        }

        private static string GetIpAddress(HttpContext context)
        {
            return context.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        }

        private static string HmacSHA512(string key, string inputData)
        {
            var hash = new StringBuilder();
            byte[] keyBytes = Encoding.UTF8.GetBytes(key);
            byte[] inputBytes = Encoding.UTF8.GetBytes(inputData);
            using (var hmac = new HMACSHA512(keyBytes))
            {
                byte[] hashValue = hmac.ComputeHash(inputBytes);
                foreach (var theByte in hashValue)
                {
                    hash.Append(theByte.ToString("x2"));
                }
            }

            return hash.ToString();
        }
    }

    public class VnPayCompare : IComparer<string>
    {
        public int Compare(string? x, string? y)
        {
            if (x == y) return 0;
            if (x == null) return -1;
            if (y == null) return 1;
            var vnpCompare = string.Compare(x, y, StringComparison.Ordinal);
            if (vnpCompare != 0) return vnpCompare;
            return string.Compare(x, y, StringComparison.Ordinal);
        }
    }
}
