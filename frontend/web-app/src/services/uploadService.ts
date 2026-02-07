import { axiosInstance } from '@/lib/axios';

export const uploadService = {
    async uploadImage(file: File): Promise<{ url: string }> {
        const formData = new FormData();
        formData.append('file', file);

        const res = await axiosInstance.post<{ url: string }>('/api/fileupload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return res.data;
    },
};
