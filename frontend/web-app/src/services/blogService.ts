import { axiosInstance } from '@/lib/axios';
import {
    BlogPostDto,
    CreateBlogPostRequest,
    UpdateBlogPostRequest,
    PagedResult,
} from '@/types/generated-api';

export const blogService = {
    async getBlogs(
        page = 1,
        pageSize = 10,
        isPublished?: boolean,
        categoryId?: string
    ): Promise<PagedResult<BlogPostDto>> {
        const params: Record<string, any> = { page, pageSize };
        if (isPublished !== undefined) params.isPublished = isPublished;
        if (categoryId) params.categoryId = categoryId;
        const res = await axiosInstance.get<PagedResult<BlogPostDto>>('/api/blogposts', { params });
        return res.data;
    },

    async getBlogById(id: string): Promise<BlogPostDto> {
        const res = await axiosInstance.get<BlogPostDto>(`/api/blogposts/${id}`);
        return res.data;
    },

    async createBlog(payload: CreateBlogPostRequest): Promise<BlogPostDto> {
        const res = await axiosInstance.post<BlogPostDto>('/api/blogposts', payload);
        return res.data;
    },

    async updateBlog(id: string, payload: UpdateBlogPostRequest): Promise<void> {
        await axiosInstance.put(`/api/blogposts/${id}`, payload);
    },

    async deleteBlog(id: string): Promise<void> {
        await axiosInstance.delete(`/api/blogposts/${id}`);
    },

    async togglePublish(id: string): Promise<{ isPublished: boolean; publishedAt?: string }> {
        const res = await axiosInstance.patch<{ isPublished: boolean; publishedAt?: string }>(
            `/api/blogposts/${id}/publish`
        );
        return res.data;
    },
};
