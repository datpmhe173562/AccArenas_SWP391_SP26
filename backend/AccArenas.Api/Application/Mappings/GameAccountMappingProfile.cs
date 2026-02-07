using System;
using System.Linq;
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
                )
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.Images));

            CreateMap<CreateGameAccountRequest, GameAccount>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.ImageUrls));

            CreateMap<UpdateGameAccountRequest, GameAccount>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.Images, opt => opt.MapFrom(src => src.ImageUrls));
        }
    }
}
