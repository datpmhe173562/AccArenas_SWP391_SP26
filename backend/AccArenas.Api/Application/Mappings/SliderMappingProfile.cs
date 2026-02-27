using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Domain.Models;
using AutoMapper;

namespace AccArenas.Api.Application.Mappings
{
    public class SliderMappingProfile : Profile
    {
        public SliderMappingProfile()
        {
            // Slider -> SliderDto
            CreateMap<Slider, SliderDto>();

            // CreateSliderRequest -> Slider
            CreateMap<CreateSliderRequest, Slider>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());

            // UpdateSliderRequest -> Slider
            CreateMap<UpdateSliderRequest, Slider>()
                .ForMember(dest => dest.Id, opt => opt.Ignore());
        }
    }
}
