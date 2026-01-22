using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Domain.Models;
using AutoMapper;

namespace AccArenas.Api.Application.Mappings
{
    public class GameAccountMappingProfile : Profile
    {
        public GameAccountMappingProfile()
        {
            CreateMap<GameAccount, GameAccountDto>()
                .ForMember(
                    dest => dest.CategoryName,
                    opt =>
                        opt.MapFrom(src => src.Category != null ? src.Category.Name : string.Empty)
                );

            CreateMap<CreateGameAccountRequest, GameAccount>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Category, opt => opt.Ignore());

            CreateMap<UpdateGameAccountRequest, GameAccount>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore());
        }
    }
}
