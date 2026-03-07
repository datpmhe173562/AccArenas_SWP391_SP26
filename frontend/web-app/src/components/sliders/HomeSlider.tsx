"use client";

import { useState, useEffect } from "react";
import { useSliders } from "@/hooks/useSliders";
import Link from "next/link";

export default function HomeSlider() {
    const { data: slidersData, isLoading } = useSliders(1, 5, true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const sliders = slidersData?.items || [];

    useEffect(() => {
        if (sliders.length <= 1) return;
        
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % sliders.length);
        }, 5000);
        
        return () => clearInterval(interval);
    }, [sliders.length]);

    if (isLoading) {
        return (
            <div className="relative w-full h-[400px] md:h-[500px] bg-gray-200 animate-pulse rounded-3xl overflow-hidden mb-12">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>
        );
    }

    if (sliders.length === 0) return null;

    return (
        <section className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 shadow-2xl group">
            {/* Slides */}
            <div className="relative w-full h-full">
                {sliders.map((slider, index) => (
                    <div
                        key={slider.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                            index === currentIndex 
                                ? "opacity-100 translate-x-0 scale-100" 
                                : "opacity-0 translate-x-full scale-105 pointer-events-none"
                        }`}
                    >
                        {/* Background Image */}
                        <div className="absolute inset-0">
                            <img
                                src={slider.imageUrl || "https://hoanghamobile.com/tin-tuc/wp-content/uploads/2024/06/game-wallpaper-4k-31.jpg"}
                                alt={slider.title}
                                className="w-full h-full object-cover"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent"></div>
                        </div>

                        {/* Content */}
                        <div className="relative h-full max-w-7xl mx-auto px-8 md:px-16 flex flex-col justify-center items-start">
                            <div className="max-w-2xl space-y-6">
                                <h2 className="text-4xl md:text-6xl font-black text-white leading-tight drop-shadow-lg">
                                    {slider.title}
                                </h2>

                                {slider.linkUrl && (
                                    <Link
                                        href={slider.linkUrl}
                                        className="inline-flex items-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 active:scale-95"
                                    >
                                        Khám phá ngay
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            {sliders.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 z-10">
                    {sliders.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`transition-all duration-300 rounded-full ${
                                index === currentIndex 
                                    ? "w-10 h-3 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]" 
                                    : "w-3 h-3 bg-white/50 hover:bg-white/80"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Arrow Controls */}
            {sliders.length > 1 && (
                <>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length)}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                    <button
                        onClick={() => setCurrentIndex((prev) => (prev + 1) % sliders.length)}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-white/20"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </>
            )}
        </section>
    );
}
