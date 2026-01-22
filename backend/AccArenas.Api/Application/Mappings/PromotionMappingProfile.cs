using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Domain.Models;
using AutoMapper;

namespace AccArenas.Api.Application.Mappings
{
    public class PromotionMappingProfile : Profile
    {
        public PromotionMappingProfile()
        {
            // Promotion -> PromotionDto
            CreateMap<Promotion, PromotionDto>();

            // CreatePromotionRequest -> Promotion
            CreateMap<CreatePromotionRequest, Promotion>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow));

            // UpdatePromotionRequest -> Promotion
            CreateMap<UpdatePromotionRequest, Promotion>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore());
        }
    }
}
