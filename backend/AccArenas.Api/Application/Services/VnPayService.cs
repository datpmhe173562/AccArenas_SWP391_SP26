using System.Globalization;
using System.Net;
using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Application.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

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
        private readonly ILogger<VnPayService> _logger;

        public VnPayService(IConfiguration configuration, ILogger<VnPayService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public string CreatePaymentUrl(HttpContext context, PaymentInformationRequest model)
        {
            var vnpay = new VnPayLibrary();

            var timeZoneId = OperatingSystem.IsWindows()
                ? "SE Asia Standard Time"
                : "Asia/Ho_Chi_Minh";
            var timeZoneById = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);
            var timeNow = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, timeZoneById);
            var tick = DateTime.Now.Ticks.ToString();

            vnpay.AddRequestData("vnp_Version", "2.1.0");
            vnpay.AddRequestData("vnp_Command", "pay");
            vnpay.AddRequestData("vnp_TmnCode", _configuration["VnPay:TmnCode"]!);
            vnpay.AddRequestData(
                "vnp_Amount",
                (model.Amount * 100).ToString("F0", CultureInfo.InvariantCulture)
            );
            vnpay.AddRequestData("vnp_CreateDate", timeNow.ToString("yyyyMMddHHmmss"));
            vnpay.AddRequestData("vnp_CurrCode", "VND");
            vnpay.AddRequestData("vnp_IpAddr", Utils.GetIpAddress(context));
            vnpay.AddRequestData("vnp_Locale", "vn");
            vnpay.AddRequestData("vnp_OrderInfo", "Payment for order:" + model.OrderId);
            vnpay.AddRequestData("vnp_OrderType", "other");
            vnpay.AddRequestData("vnp_ReturnUrl", _configuration["VnPay:ReturnUrl"]!);
            // Use full Guid string for vnp_TxnRef
            vnpay.AddRequestData("vnp_TxnRef", model.OrderId);

            var paymentUrl = vnpay.CreateRequestUrl(
                _configuration["VnPay:BaseUrl"]!,
                _configuration["VnPay:HashSecret"]!
            );

            _logger.LogInformation("VNPay CreatePayment URL created: {Url}", paymentUrl);

            return paymentUrl;
        }

        public PaymentResponse PaymentExecute(IQueryCollection collections)
        {
            var vnpay = new VnPayLibrary();
            foreach (var (key, value) in collections)
            {
                if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
                {
                    vnpay.AddResponseData(key, value.ToString());
                }
            }

            var vnp_SecureHash = collections
                .FirstOrDefault(p => p.Key == "vnp_SecureHash")
                .Value.ToString();
            bool checkSignature = vnpay.ValidateSignature(
                vnp_SecureHash!,
                _configuration["VnPay:HashSecret"]!
            );

            var txnRef = vnpay.GetResponseData("vnp_TxnRef");
            var vnp_ResponseCode = vnpay.GetResponseData("vnp_ResponseCode");
            var vnp_TransactionId = vnpay.GetResponseData("vnp_TransactionNo");

            _logger.LogInformation(
                "VNPay PaymentReturn received. txnRef={TxnRef}, respCode={RespCode}, signatureValid={IsValid}",
                txnRef,
                vnp_ResponseCode,
                checkSignature
            );

            bool isSuccess = checkSignature && vnp_ResponseCode == "00";

            // Reconstruct the OrderId robustly
            string orderId = string.Empty;
            var orderInfo = vnpay.GetResponseData("vnp_OrderInfo");

            // Try txnRef first
            if (!string.IsNullOrEmpty(txnRef) && Guid.TryParse(txnRef, out var guidTxn))
            {
                orderId = guidTxn.ToString();
            }
            // Fallback to orderInfo if txnRef is truncated or mangled
            else if (!string.IsNullOrEmpty(orderInfo))
            {
                // In case it has prefix "Payment for order:", try to extract Guid
                var match = System.Text.RegularExpressions.Regex.Match(orderInfo, @"([a-fA-F0-9-]{36})");
                if (match.Success && Guid.TryParse(match.Value, out var guidInfo))
                {
                    orderId = guidInfo.ToString();
                }
                else if (Guid.TryParse(orderInfo, out var guidInfoDirect))
                {
                    orderId = guidInfoDirect.ToString();
                }
            }
            // Final fallback to hex parsing if dashes were stripped in txnRef
            if (string.IsNullOrEmpty(orderId) && !string.IsNullOrEmpty(txnRef) && txnRef.Length >= 32)
            {
                var hex = txnRef.Substring(0, 32);
                if (Guid.TryParseExact(hex, "N", out var guidN))
                {
                    orderId = guidN.ToString();
                }
            }

            return new PaymentResponse
            {
                Success = isSuccess,
                PaymentMethod = "VnPay",
                OrderDescription = vnpay.GetResponseData("vnp_OrderInfo"),
                OrderId = orderId,
                TransactionId = vnp_TransactionId,
                Token = vnp_SecureHash,
                VnPayResponseCode = vnp_ResponseCode,
            };
        }
    }
}
