import React, { useState } from 'react';

export default function ManageBannersPage() {
    // Mock data for banners
    const [banners, setBanners] = useState([
        { id: 1, name: 'Homepage Hero', location: 'Home - Top', status: 'Active', image: 'https://via.placeholder.com/800x200?text=Hero+Banner', link: '/sale' },
        { id: 2, name: 'Sidebar Promo', location: 'Shop - Sidebar', status: 'Inactive', image: 'https://via.placeholder.com/300x600?text=Sidebar+Ad', link: '/promo' },
        { id: 3, name: 'Footer Banner', location: 'All - Footer', status: 'Active', image: 'https://via.placeholder.com/1200x150?text=Footer+Banner', link: '/app-download' },
    ]);

    return (
        <div className="container py-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Banners</h1>
                    <p className="text-gray-600 mt-1">Control advertisement and informational banners.</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors flex items-center gap-2">
                    <span>+</span> Upload Banner
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {banners.map((banner) => (
                    <div key={banner.id} className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-6 items-start md:items-center">
                        <div className="w-full md:w-1/3 bg-gray-100 rounded-lg overflow-hidden border">
                            <img src={banner.image} alt={banner.name} className="w-full h-auto object-cover" />
                        </div>

                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">{banner.name}</h3>
                                    <p className="text-gray-500 text-sm">Location: {banner.location}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${banner.status === 'Active' ? 'bg-success bg-opacity-10 text-success' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                    {banner.status}
                                </span>
                            </div>

                            <div className="pt-2">
                                <label className="text-xs text-gray-500 uppercase font-semibold">Target Link</label>
                                <div className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
                                    <span className="text-sm truncate">{banner.link}</span>
                                    <span className="text-xs">↗</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex md:flex-col gap-2 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 md:border-l pl-0 md:pl-6">
                            <button className="flex-1 md:flex-none px-4 py-2 border rounded hover:bg-gray-50 text-sm whitespace-nowrap">Edit Details</button>
                            <button className="flex-1 md:flex-none px-4 py-2 border rounded hover:bg-red-50 text-danger border-danger text-sm whitespace-nowrap">Delete</button>
                            <button className="flex-1 md:flex-none px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm whitespace-nowrap">
                                {banner.status === 'Active' ? 'Deactivate' : 'Activate'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
