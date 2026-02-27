import MarketerLayout from "@/components/layout/MarketerLayout";
import { SearchBlogs } from "@/components/blogs/search-blogs";

export default function MarketerBlogsPage() {
    return (
        <MarketerLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Quản lý Bài viết</h1>
                    <p className="text-gray-600">Tạo và quản lý bài viết blog</p>
                </div>
                <SearchBlogs />
            </div>
        </MarketerLayout>
    );
}
