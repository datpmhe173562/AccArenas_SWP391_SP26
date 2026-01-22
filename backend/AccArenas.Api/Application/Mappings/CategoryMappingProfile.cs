using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Domain.Models;
using AutoMapper;

namespace AccArenas.Api.Application.Mappings
{
    public class CategoryMappingProfile : Profile
    {
        public CategoryMappingProfile()
        {
            CreateMap<Category, CategoryDto>();

            CreateMap<CreateCategoryRequest, Category>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(
                    dest => dest.Slug,
                    opt =>
                        opt.MapFrom(src =>
                            string.IsNullOrEmpty(src.Slug)
                                ? src.Name.ToLower().Replace(" ", "-")
                                : src.Slug
                        )
                );

            CreateMap<UpdateCategoryRequest, Category>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(
                    dest => dest.Slug,
                    opt =>
                        opt.MapFrom(src =>
                            string.IsNullOrEmpty(src.Slug)
                                ? src.Name.ToLower().Replace(" ", "-")
                                : src.Slug
                        )
                );
        }
    }
}
