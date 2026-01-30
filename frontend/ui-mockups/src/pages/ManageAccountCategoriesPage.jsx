import React, { useState } from 'react';

export default function ManageAccountCategoriesPage() {
    const [categories, setCategories] = useState([
        { id: 1, name: 'FPS Games', count: 120, status: 'Active', subcategories: ['Valorant', 'CS:GO', 'Overwatch 2'] },
        { id: 2, name: 'MOBA Games', count: 85, status: 'Active', subcategories: ['League of Legends', 'Dota 2'] },
        { id: 3, name: 'RPG Games', count: 45, status: 'Active', subcategories: ['Genshin Impact', 'World of Warcraft'] },
        { id: 4, name: 'Battle Royale', count: 0, status: 'Inactive', subcategories: [] },
    ]);

    return (
        <div className="container py-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Categories</h1>
                    <p className="text-gray-600 mt-1">Organize game account types and genres.</p>
                </div>
                <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors flex items-center gap-2">
                    <span>+</span> Add Category
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    <div key={category.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold text-lg">
                                    {category.name.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{category.name}</h3>
                                    <p className="text-xs text-gray-500">{category.count} Products Reassign</p>
                                </div>
                            </div>
                            <div className="relative group">
                                <button className="text-gray-400 hover:text-gray-600">•••</button>
                                <div className="absolute right-0 top-6 w-32 bg-white shadow-lg border rounded-lg hidden group-hover:block z-10">
                                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-gray-700">Edit</button>
                                    <button className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-danger">Delete</button>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">Subcategories</label>
                            <div className="flex flex-wrap gap-2">
                                {category.subcategories.length > 0 ? (
                                    category.subcategories.map((sub, index) => (
                                        <span key={index} className="bg-gray-50 border px-2 py-1 rounded text-xs text-gray-600">
                                            {sub}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-gray-400 italic">No subcategories</span>
                                )}
                                <button className="px-2 py-1 rounded border border-dashed text-xs text-gray-400 hover:text-primary hover:border-primary transition-colors">
                                    + Add
                                </button>
                            </div>
                        </div>

                        <div className="pt-4 border-t flex justify-between items-center">
                            <span className={`text-xs font-medium px-2 py-1 rounded-full ${category.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                }`}>
                                {category.status}
                            </span>
                            <label className="flex items-center cursor-pointer">
                                <div className="relative">
                                    <input type="checkbox" className="sr-only" checked={category.status === 'Active'} readOnly />
                                    <div className={`w-10 h-5 bg-gray-200 rounded-full shadow-inner transition-colors ${category.status === 'Active' ? 'bg-primary' : ''}`}></div>
                                    <div className={`dot absolute w-3 h-3 bg-white rounded-full shadow left-1 top-1 transition-transform ${category.status === 'Active' ? 'transform translate-x-5' : ''}`}></div>
                                </div>
                            </label>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder */}
                <button className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-gray-50 transition-all group">
                    <span className="text-4xl mb-2 group-hover:scale-110 transition-transform">+</span>
                    <span className="font-medium">Create New Category</span>
                </button>
            </div>
        </div>
    );
}
