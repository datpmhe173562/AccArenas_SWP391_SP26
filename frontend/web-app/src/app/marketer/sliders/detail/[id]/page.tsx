"use client";

import { useRouter, useParams } from "next/navigation";
import MarketerLayout from "@/components/layout/MarketerLayout";
import { useSlider, useToggleSliderStatus, useDeleteSlider } from "@/hooks/useSliders";
import { showConfirm, showSuccess, showError } from "@/lib/sweetalert";

export default function SliderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { data: slider, isLoading, refetch } = useSlider(id);
    const toggleStatus = useToggleSliderStatus();
    const deleteSlider = useDeleteSlider();

    const handleToggle = async () => {
        try {
            await toggleStatus.mutateAsync(id);
            showSuccess(slider?.isActive ? "Đã tắt slider" : "Đã bật slider");
            refetch();
        } catch (err: any) {
            showError(err.message);
        }
    };

    const handleDelete = async () => {
        const confirmed = await showConfirm(`Xóa slider "${slider?.title}"?`, "Xác nhận xóa");
        if (!confirmed) return;
        try {
            await deleteSlider.mutateAsync(id);
            showSuccess("Đã xóa slider");
            router.push("/marketer/sliders");
        } catch (err: any) {
            showError(err.message);
        }
    };

    if (isLoading) return <MarketerLayout><div className="flex justify-center items-center h-64 text-gray-500">Đang tải...</div></MarketerLayout>;
    if (!slider) return <MarketerLayout><div className="flex justify-center items-center h-64 text-gray-500">Không tìm thấy slider</div></MarketerLayout>;

    return (
        <MarketerLayout>
            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Chi tiết Slider</h1>
                                <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${slider.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                    {slider.isActive ? "Đang hoạt động" : "Không hoạt động"}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={handleToggle} className={`px-4 py-2 text-sm rounded-md ${slider.isActive ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" : "bg-green-600 text-white hover:bg-green-700"}`}>
                                {slider.isActive ? "Tắt" : "Bật"}
                            </button>
                            <button onClick={() => router.push(`/marketer/sliders/update/${id}`)} className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Cập nhật</button>
                            <button onClick={handleDelete} className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700">Xóa</button>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6 space-y-6">
                    <div className="rounded-lg overflow-hidden bg-gray-100 w-full max-w-2xl h-64">
                        {slider.imageUrl ? (
                            <img src={slider.imageUrl} alt={slider.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Tiêu đề</p>
                            <p className="mt-1 text-base font-semibold text-gray-900">{slider.title}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase">Thứ tự</p>
                            <p className="mt-1 text-sm text-gray-700">{slider.order}</p>
                        </div>
                        <div className="md:col-span-2">
                            <p className="text-xs text-gray-400 uppercase">URL Hình ảnh</p>
                            <p className="mt-1 text-sm text-blue-600 break-all">{slider.imageUrl}</p>
                        </div>
                        {slider.linkUrl && (
                            <div className="md:col-span-2">
                                <p className="text-xs text-gray-400 uppercase">Link URL</p>
                                <p className="mt-1 text-sm text-blue-600 break-all">{slider.linkUrl}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MarketerLayout>
    );
}
