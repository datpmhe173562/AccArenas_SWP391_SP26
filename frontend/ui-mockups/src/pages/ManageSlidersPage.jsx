import React, { useState } from 'react';

export default function ManageSlidersPage() {
    const [slides, setSlides] = useState([
        { id: 1, title: 'Summer Collection', caption: 'Up to 50% Off', image: 'https://via.placeholder.com/1600x600?text=Slide+1', order: 1, active: true },
        { id: 2, title: 'New Arrivals', caption: 'Check out the latest games', image: 'https://via.placeholder.com/1600x600?text=Slide+2', order: 2, active: true },
        { id: 3, title: 'Exclusive Offer', caption: 'Limited Time Only', image: 'https://via.placeholder.com/1600x600?text=Slide+3', order: 3, active: false },
    ]);

    return (
        <div className="container py-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Sliders</h1>
                    <p className="text-gray-600 mt-1">Configure homepage carousel slides.</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors flex items-center gap-2">
                    <span>+</span> Add Slide
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* List Section */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Current Slides</h2>
                    {slides.sort((a, b) => a.order - b.order).map((slide) => (
                        <div key={slide.id} className={`bg-white p-4 rounded-xl shadow-sm border flex gap-4 ${!slide.active ? 'opacity-60 grayscale' : ''}`}>
                            <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h3 className="font-bold text-gray-900">{slide.title}</h3>
                                    <span className="text-xs bg-gray-100 px-2 py-1 rounded">Order: {slide.order}</span>
                                </div>
                                <p className="text-sm text-gray-500">{slide.caption}</p>
                            </div>
                            <div className="flex flex-col gap-1 justify-center">
                                <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-primary">↑</button>
                                <button className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-primary">↓</button>
                            </div>
                            <div className="flex flex-col gap-2 justify-center ml-2 border-l pl-2">
                                <button className="text-xs text-primary hover:underline">Edit</button>
                                <button className="text-xs text-danger hover:underline">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Preview Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border h-fit sticky top-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Preview</h2>
                    <div className="relative aspect-[16/6] bg-gray-900 rounded-lg overflow-hidden group">
                        <img src={slides[0].image} alt="Preview" className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center p-4">
                            <h2 className="text-2xl md:text-4xl font-bold mb-2">{slides[0].title}</h2>
                            <p className="text-lg md:text-xl mb-6">{slides[0].caption}</p>
                            <button className="px-6 py-2 bg-primary hover:bg-primary-hover text-white rounded-full transition-colors">
                                Shop Now
                            </button>
                        </div>

                        {/* Mock Controls */}
                        <div className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 p-2 rounded-full cursor-pointer">
                            ❮
                        </div>
                        <div className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-40 p-2 rounded-full cursor-pointer">
                            ❯
                        </div>
                        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                            <div className="w-2 h-2 rounded-full bg-white bg-opacity-50"></div>
                            <div className="w-2 h-2 rounded-full bg-white bg-opacity-50"></div>
                        </div>
                    </div>
                    <p className="text-center text-sm text-gray-400 mt-4">
                        * This preview shows the first active slide as it would appear on the homepage.
                    </p>
                </div>
            </div>
        </div>
    );
}
