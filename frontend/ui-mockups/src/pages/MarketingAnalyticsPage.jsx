import React from 'react';

export default function MarketingAnalyticsPage() {
    return (
        <div className="container py-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Marketing Analytics</h1>
                    <p className="text-gray-600 mt-1">Overview of products, promotions, and customer engagement.</p>
                </div>
                <div className="flex gap-2">
                    <select className="p-2 border rounded bg-white" defaultValue="7d">
                        <option value="24h">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                    </select>
                    <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors">
                        Export Report
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <p className="text-sm font-medium text-gray-500">Total Visits</p>
                    <p className="text-2xl font-bold mt-1">124,592</p>
                    <div className="text-sm text-success mt-1 flex items-center">
                        <span>↑ 12%</span>
                        <span className="text-gray-400 ml-1">vs last period</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <p className="text-sm font-medium text-gray-500">Bounce Rate</p>
                    <p className="text-2xl font-bold mt-1">42.3%</p>
                    <div className="text-sm text-danger mt-1 flex items-center">
                        <span>↑ 2.1%</span>
                        <span className="text-gray-400 ml-1">vs last period</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                    <p className="text-2xl font-bold mt-1">3.8%</p>
                    <div className="text-sm text-success mt-1 flex items-center">
                        <span>↑ 0.5%</span>
                        <span className="text-gray-400 ml-1">vs last period</span>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <p className="text-sm font-medium text-gray-500">Avg. Session Duration</p>
                    <p className="text-2xl font-bold mt-1">4m 12s</p>
                    <div className="text-sm text-success mt-1 flex items-center">
                        <span>↑ 14s</span>
                        <span className="text-gray-400 ml-1">vs last period</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
                {/* Mock Chart Area 1 - Visitor Traffic */}
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <h2 className="text-lg font-semibold mb-4">Visitor Traffic</h2>
                    <div className="w-full h-64 bg-gray-50 rounded flex items-end justify-between px-4 pb-4 gap-2 border border-dashed border-gray-300 relative">
                        {/* Simple CSS Bar Chart Mockup */}
                        {[40, 65, 55, 80, 70, 90, 85].map((height, i) => (
                            <div key={i} className="w-full bg-primary bg-opacity-80 hover:bg-opacity-100 rounded-t transition-all cursor-pointer relative group" style={{ height: `${height}%` }}>
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                    {height * 100} visits
                                </div>
                            </div>
                        ))}
                        <div className="absolute bottom-0 w-full text-center text-gray-400 text-xs py-2">Mon Tue Wed Thu Fri Sat Sun</div>
                    </div>
                </div>

                {/* Mock Chart Area 2 - Revenue Source */}
                <div className="bg-white p-4 rounded-xl shadow-sm border">
                    <h2 className="text-lg font-semibold mb-4">Revenue by Category</h2>
                    <div className="w-full h-64 flex items-center justify-center relative">
                        {/* Simple CSS Circle Chart Mockup */}
                        <div className="relative w-48 h-48 rounded-full bg-blue-100" style={{
                            background: 'conic-gradient(var(--color-primary) 0% 40%, var(--color-success) 40% 70%, var(--color-warning) 70% 90%, var(--color-danger) 90% 100%)'
                        }}>
                            <div className="absolute inset-0 m-auto w-32 h-32 bg-white rounded-full flex flex-col items-center justify-center">
                                <span className="text-gray-500 text-sm">Total</span>
                                <span className="text-xl font-bold">$12,450</span>
                            </div>
                        </div>
                        <div className="ml-8 space-y-2">
                            <div className="flex items-center text-sm"><span className="w-3 h-3 bg-primary rounded-full mr-2"></span>Game Bundles (40%)</div>
                            <div className="flex items-center text-sm"><span className="w-3 h-3 bg-success rounded-full mr-2"></span>Premium Subs (30%)</div>
                            <div className="flex items-center text-sm"><span className="w-3 h-3 bg-warning rounded-full mr-2"></span>Accessories (20%)</div>
                            <div className="flex items-center text-sm"><span className="w-3 h-3 bg-danger rounded-full mr-2"></span>Other (10%)</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Top Performing Campaigns</h2>
                    <a href="#" className="text-sm text-primary hover:underline">View All</a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b text-gray-500 text-sm">
                                <th className="py-2 px-4 font-medium">Campaign Name</th>
                                <th className="py-2 px-4 font-medium">Status</th>
                                <th className="py-2 px-4 font-medium">Impressions</th>
                                <th className="py-2 px-4 font-medium">Clicks</th>
                                <th className="py-2 px-4 font-medium">Conversion</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">Summer Sale 2024</td>
                                <td className="py-3 px-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full bg-opacity-20 text-success font-medium">Active</span></td>
                                <td className="py-3 px-4">45,200</td>
                                <td className="py-3 px-4">3,120</td>
                                <td className="py-3 px-4">6.9%</td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">New User Promo</td>
                                <td className="py-3 px-4"><span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full bg-opacity-20 text-success font-medium">Active</span></td>
                                <td className="py-3 px-4">22,100</td>
                                <td className="py-3 px-4">1,840</td>
                                <td className="py-3 px-4">8.3%</td>
                            </tr>
                            <tr className="border-b hover:bg-gray-50">
                                <td className="py-3 px-4">Weekend Flash Deal</td>
                                <td className="py-3 px-4"><span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full bg-opacity-20 text-gray-500 font-medium">Ended</span></td>
                                <td className="py-3 px-4">12,500</td>
                                <td className="py-3 px-4">980</td>
                                <td className="py-3 px-4">7.8%</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
