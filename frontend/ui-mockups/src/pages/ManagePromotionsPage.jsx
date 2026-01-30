import React, { useState } from 'react';

export default function ManagePromotionsPage() {
  const [showFilter, setShowFilter] = useState(false);
  const [promotions, setPromotions] = useState([
    { id: 1, name: 'Summer Sale 2024', code: 'SUMMER24', discount: '20%', type: 'Percentage', status: 'Active', startDate: '2024-06-01', endDate: '2024-06-30' },
    { id: 2, name: 'Welcome Bonus', code: 'WELCOME10', discount: '10%', type: 'Percentage', status: 'Active', startDate: '2024-01-01', endDate: '2024-12-31' },
    { id: 3, name: 'Winter Clearance', code: 'WINTER50', discount: '50%', type: 'Fixed Amount', status: 'Expired', startDate: '2023-12-01', endDate: '2023-12-31' },
  ]);

  return (
    <div className="container py-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Promotions</h1>
          <p className="text-gray-600 mt-1">Create and manage discounts and vouchers.</p>
        </div>
        <button className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover transition-colors flex items-center gap-2">
          <span>+</span> Create Promotion
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border mb-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search promotions..."
              className="w-full pl-10 pr-4 py-2 border rounded focus:outline-none focus:border-primary"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="px-4 py-2 border rounded hover:bg-gray-50 text-gray-700 flex items-center gap-2"
            >
              Filter <span>▼</span>
            </button>
            <select className="px-4 py-2 border rounded focus:outline-none bg-white">
              <option>Sort by: Newest</option>
              <option>Sort by: Starting Soon</option>
              <option>Sort by: Ending Soon</option>
            </select>
          </div>
        </div>

        {showFilter && (
          <div className="mt-4 p-4 bg-gray-50 rounded border animate-slideDown">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full p-2 border rounded bg-white">
                  <option>All Statuses</option>
                  <option>Active</option>
                  <option>Scheduled</option>
                  <option>Expired</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
                <select className="w-full p-2 border rounded bg-white">
                  <option>All Types</option>
                  <option>Percentage</option>
                  <option>Fixed Amount</option>
                </select>
              </div>
              <div className="flex items-end">
                <button className="text-primary hover:underline text-sm">Clear Filters</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="py-3 px-6 font-semibold text-gray-600">Promotion Name</th>
                <th className="py-3 px-6 font-semibold text-gray-600">Code</th>
                <th className="py-3 px-6 font-semibold text-gray-600">Discount</th>
                <th className="py-3 px-6 font-semibold text-gray-600">Duration</th>
                <th className="py-3 px-6 font-semibold text-gray-600">Status</th>
                <th className="py-3 px-6 font-semibold text-gray-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {promotions.map((promo) => (
                <tr key={promo.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">{promo.name}</div>
                    <div className="text-xs text-gray-500">{promo.type}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">{promo.code}</span>
                  </td>
                  <td className="py-4 px-6 font-bold text-primary">{promo.discount}</td>
                  <td className="py-4 px-6 text-sm text-gray-600">
                    <div>{promo.startDate}</div>
                    <div className="text-xs text-gray-400">to {promo.endDate}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${promo.status === 'Active' ? 'bg-success bg-opacity-10 text-success' :
                        promo.status === 'Expired' ? 'bg-gray-100 text-gray-500' :
                          'bg-warning bg-opacity-10 text-warning'
                      }`}>
                      {promo.status}
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
        <div className="p-4 border-t flex justify-between items-center bg-gray-50">
          <span className="text-sm text-gray-500">Showing 3 of 3 promotions</span>
          <div className="flex gap-1">
            <button className="px-3 py-1 border rounded bg-white disabled:opacity-50" disabled>Prev</button>
            <button className="px-3 py-1 border rounded bg-primary text-white">1</button>
            <button className="px-3 py-1 border rounded bg-white disabled:opacity-50" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
