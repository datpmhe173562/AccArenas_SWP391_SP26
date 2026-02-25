using AccArenas.Api.Application.DTOs;
using AccArenas.Api.Domain.Models;
using AutoMapper;

namespace AccArenas.Api.Application.Mappings
{
    public class BlogPostMappingProfile : Profile
    {
        public BlogPostMappingProfile()
        {
            // BlogPost -> BlogPostDto
            CreateMap<BlogPost, BlogPostDto>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category != null ? src.Category.Name : null));

            // CreateBlogPostRequest -> BlogPost
            CreateMap<CreateBlogPostRequest, BlogPost>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.PublishedAt, opt => opt.MapFrom(src => src.IsPublished ? (DateTime?)DateTime.UtcNow : null))
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.Slug, opt => opt.MapFrom(src =>
                    string.IsNullOrEmpty(src.Slug)
                        ? src.Title.ToLower().Replace(" ", "-")
                        : src.Slug
                ));

            // UpdateBlogPostRequest -> BlogPost
            CreateMap<UpdateBlogPostRequest, BlogPost>()
                .ForMember(dest => dest.Id, opt => opt.Ignore())
                .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
                .ForMember(dest => dest.Category, opt => opt.Ignore())
                .ForMember(dest => dest.Slug, opt => opt.MapFrom(src =>
                    string.IsNullOrEmpty(src.Slug)
                        ? src.Title.ToLower().Replace(" ", "-")
                        : src.Slug
                ));
        }
    }
}
