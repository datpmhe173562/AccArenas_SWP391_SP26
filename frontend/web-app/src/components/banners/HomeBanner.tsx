"use client";

import { useBanners } from "@/hooks/useBanners";
import Link from "next/link";

export default function HomeBanner() {
    const { data: bannersData, isLoading } = useBanners(1, 10, true);
    const banners = bannersData?.items || [];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                {[1, 2].map(i => (
                    <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-2xl" />
                ))}
            </div>
        );
    }

    if (banners.length === 0) return null;

    return (
        <section className="mb-12">
            <div className={`grid gap-4 ${banners.length === 1 ? "grid-cols-1" : banners.length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-3"}`}>
                {banners.sort((a, b) => a.order - b.order).map((banner) => (
                    <div key={banner.id} className="group relative h-40 md:h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
                        {/* Banner Image */}
                        <img
                            src={banner.imageUrl || "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-wallpaper-4k-31.jpg"}
                            alt={banner.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-wallpaper-4k-31.jpg";
                            }}
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        {/* Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h3 className="text-white font-bold text-lg drop-shadow-lg line-clamp-1">{banner.title}</h3>
                            {banner.linkUrl && (
                                <Link
                                    href={banner.linkUrl}
                                    className="mt-2 inline-flex items-center text-sm text-indigo-300 hover:text-white font-medium transition-colors"
                                >
                                    Xem ngay
                                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
