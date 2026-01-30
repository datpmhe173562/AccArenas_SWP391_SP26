import React, { useState } from 'react';

export default function UserRoleManagementPage() {
    const [users, setUsers] = useState([
        { id: 101, name: 'John Doe', email: 'john.doe@example.com', currentRole: 'Customer', status: 'Active' },
        { id: 102, name: 'Jane Smith', email: 'jane.smith@store.com', currentRole: 'Sales Staff', status: 'Active' },
        { id: 103, name: 'Mike Johnson', email: 'mike.j@marketing.com', currentRole: 'Marketing Staff', status: 'Active' },
        { id: 104, name: 'Sarah Connor', email: 'sarah.c@admin.com', currentRole: 'Admin', status: 'Active' },
        { id: 105, name: 'Guest User 1', email: 'guest1@example.com', currentRole: 'Guest', status: 'Inactive' },
    ]);

    const roles = ['Guest', 'Customer', 'Sales Staff', 'Marketing Staff', 'Admin'];

    const handleRoleChange = (userId, newRole) => {
        setUsers(users.map(user =>
            user.id === userId ? { ...user, currentRole: newRole } : user
        ));
        // In a real app, this would trigger an API call
        console.log(`Updated user ${userId} to role ${newRole}`);
    };

    return (
        <div className="container py-4">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Role Management</h1>
                    <p className="text-gray-600 mt-1">Assign and modify user permissions.</p>
                </div>
                <div className="relative">
                    <input type="text" placeholder="Search users by email..." className="pl-10 pr-4 py-2 border rounded-full w-64 focus:outline-none focus:border-primary" />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="py-3 px-6 font-semibold text-gray-600">User Info</th>
                            <th className="py-3 px-6 font-semibold text-gray-600">Current Role</th>
                            <th className="py-3 px-6 font-semibold text-gray-600">Status</th>
                            <th className="py-3 px-6 font-semibold text-gray-600">Assign New Role</th>
                            <th className="py-3 px-6 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold">
                                            {user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-xs text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${user.currentRole === 'Admin' ? 'bg-purple-100 text-purple-700 border-purple-200' :
                                            user.currentRole === 'Marketing Staff' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                user.currentRole === 'Sales Staff' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                    'bg-gray-100 text-gray-600 border-gray-200'
                                        }`}>
                                        {user.currentRole}
                                    </span>
                                </td>
                                <td className="py-4 px-6">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-success' : 'bg-gray-400'}`}></div>
                                        <span className="text-sm text-gray-600">{user.status}</span>
                                    </div>
                                </td>
                                <td className="py-4 px-6">
                                    <select
                                        className="p-2 border rounded bg-white text-sm focus:border-primary focus:outline-none cursor-pointer"
                                        value={user.currentRole}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    >
                                        {roles.map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="py-4 px-6 text-right">
                                    <button className="text-gray-400 hover:text-primary text-sm font-medium">View History</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-4 bg-yellow-50 border-t border-yellow-100 text-yellow-800 text-sm flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <p><strong>Note:</strong> Changing a user's role will immediately update their access permissions. Ensure you categorize users correctly to maintain system security.</p>
                </div>
            </div>
        </div>
    );
}
