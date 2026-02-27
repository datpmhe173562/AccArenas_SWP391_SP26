using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Domain.Models;
using AutoMapper;

namespace AccArenas.Api.Application.Mappings
{
    public class BannerMappingProfile : Profile
    {
        public BannerMappingProfile()
        {
            // Banner -> BannerDto
            CreateMap<Banner, BannerDto>();

            // CreateBannerRequest -> Banner
            CreateMap<CreateBannerRequest, Banner>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            // UpdateBannerRequest -> Banner
            CreateMap<UpdateBannerRequest, Banner>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
        }
    }
}
