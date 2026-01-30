import React, { useState } from 'react';

export default function ManageBlogsPage() {
    const [activeTab, setActiveTab] = useState('list'); // 'list' or 'create'
    const [blogs, setBlogs] = useState([
        { id: 1, title: 'Top 10 Valorant Accounts to Buy', author: 'Admin', date: '2024-05-15', status: 'Published', views: 1250 },
        { id: 2, title: 'How to Secure Your Game Account', author: 'Admin', date: '2024-05-10', status: 'Published', views: 890 },
        { id: 3, title: 'New Payment Methods Added', author: 'System', date: '2024-05-01', status: 'Draft', views: 0 },
    ]);

    return (
        <div className="container py-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Blogs</h1>
                    <p className="text-gray-600 mt-1">Create and update news and articles.</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('list')}
                        className={`px-4 py-2 rounded transition-colors ${activeTab === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
                    >
                        All Posts
                    </button>
                    <button
                        onClick={() => setActiveTab('create')}
                        className={`px-4 py-2 rounded transition-colors ${activeTab === 'create' ? 'bg-primary text-white' : 'bg-white text-gray-700 border hover:bg-gray-50'}`}
                    >
                        Write New Post
                    </button>
                </div>
            </div>

            {activeTab === 'list' ? (
                <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="py-3 px-6 font-semibold text-gray-600">Title</th>
                                <th className="py-3 px-6 font-semibold text-gray-600">Author</th>
                                <th className="py-3 px-6 font-semibold text-gray-600">Date</th>
                                <th className="py-3 px-6 font-semibold text-gray-600">Views</th>
                                <th className="py-3 px-6 font-semibold text-gray-600">Status</th>
                                <th className="py-3 px-6 font-semibold text-gray-600 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {blogs.map((blog) => (
                                <tr key={blog.id} className="border-b hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 font-medium text-gray-900">{blog.title}</td>
                                    <td className="py-4 px-6 text-gray-600">{blog.author}</td>
                                    <td className="py-4 px-6 text-gray-600 text-sm">{blog.date}</td>
                                    <td className="py-4 px-6 text-gray-600">{blog.views}</td>
                                    <td className="py-4 px-6">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${blog.status === 'Published' ? 'bg-success bg-opacity-10 text-success' : 'bg-gray-200 text-gray-600'
                                            }`}>
                                            {blog.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        <button className="text-gray-400 hover:text-primary mr-3">✎</button>
                                        <button className="text-gray-400 hover:text-danger">🗑</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white p-6 rounded-xl shadow-sm border animate-fadeIn">
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Post Title</label>
                        <input type="text" className="w-full p-2 border rounded focus:outline-none focus:border-primary" placeholder="Enter post title..." />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <div className="border rounded">
                            <div className="bg-gray-50 border-b p-2 flex gap-2">
                                <button className="p-1 hover:bg-gray-200 rounded font-bold">B</button>
                                <button className="p-1 hover:bg-gray-200 rounded italic">I</button>
                                <button className="p-1 hover:bg-gray-200 rounded underline">U</button>
                                <span className="border-r mx-1"></span>
                                <button className="p-1 hover:bg-gray-200 rounded">H1</button>
                                <button className="p-1 hover:bg-gray-200 rounded">H2</button>
                                <button className="p-1 hover:bg-gray-200 rounded">Link</button>
                                <button className="p-1 hover:bg-gray-200 rounded">Image</button>
                            </div>
                            <textarea className="w-full p-4 h-64 focus:outline-none resize-none" placeholder="Start writing your post here..."></textarea>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors">
                                <span className="text-2xl text-gray-400 mb-2">📷</span>
                                <span className="text-sm text-gray-500">Click to upload image</span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Categories / Tags</label>
                            <input type="text" className="w-full p-2 border rounded mb-2" placeholder="Start typing to search tags..." />
                            <div className="flex flex-wrap gap-2">
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1">News <button className="hover:text-danger">×</button></span>
                                <span className="bg-gray-100 px-2 py-1 rounded text-xs flex items-center gap-1">Update <button className="hover:text-danger">×</button></span>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button className="px-6 py-2 border rounded text-gray-600 hover:bg-gray-50">Save Draft</button>
                        <button className="px-6 py-2 bg-primary text-white rounded hover:bg-primary-hover">Publish Post</button>
                    </div>
                </div>
            )}
        </div>
    );
}
