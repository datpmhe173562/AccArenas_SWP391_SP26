namespace AccArenas.Api.Application.DTOs
{
    public class PaymentInformationRequest
    {
        public string OrderType { get; set; } = string.Empty;
        public double Amount { get; set; }
        public string OrderDescription { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string OrderId { get; set; } = string.Empty;
    }

    public class PaymentResponse
    {
        public string OrderDescription { get; set; } = string.Empty;
        public string TransactionId { get; set; } = string.Empty;
        public string OrderId { get; set; } = string.Empty;
        public string PaymentMethod { get; set; } = string.Empty;
        public string PaymentId { get; set; } = string.Empty;
        public bool Success { get; set; }
        public string Token { get; set; } = string.Empty;
        public string VnPayResponseCode { get; set; } = string.Empty;
    }
}
