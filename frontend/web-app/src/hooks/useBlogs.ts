import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { blogService } from '@/services/blogService';
import { CreateBlogPostRequest, UpdateBlogPostRequest } from '@/types/generated-api';

const QUERY_KEYS = {
    blogs: 'blogs',
    blog: 'blog',
} as const;

export const useBlogs = (page = 1, pageSize = 10, isPublished?: boolean, categoryId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.blogs, { page, pageSize, isPublished, categoryId }],
        queryFn: () => blogService.getBlogs(page, pageSize, isPublished, categoryId),
    });
};

export const useBlog = (id: string, enabled = true) => {
    return useQuery({
        queryKey: [QUERY_KEYS.blog, id],
        queryFn: () => blogService.getBlogById(id),
        enabled: enabled && !!id,
    });
};

export const useCreateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateBlogPostRequest) => blogService.createBlog(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blogs] });
        },
    });
};

export const useUpdateBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateBlogPostRequest }) =>
            blogService.updateBlog(id, payload),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blogs] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blog, id] });
        },
    });
};

export const useDeleteBlog = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => blogService.deleteBlog(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blogs] });
        },
    });
};

export const useToggleBlogPublish = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => blogService.togglePublish(id),
        onSuccess: (_, id) => {
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blogs] });
            queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.blog, id] });
        },
    });
};
