import { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import DataTable from '../components/common/DataTable';
import Button from '../components/common/Button';

export default function ManageUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'active', lastLogin: '2026-01-29' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Sales Staff', status: 'active', lastLogin: '2026-01-28' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Marketing Staff', status: 'active', lastLogin: '2026-01-27' },
    { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'Admin', status: 'active', lastLogin: '2026-01-29' },
    { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', role: 'Customer', status: 'suspended', lastLogin: '2026-01-20' },
  ];

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const columns = [
    { header: 'Name', key: 'name' },
    { header: 'Email', key: 'email' },
    {
      header: 'Role',
      key: 'role',
      render: (value) => {
        const colors = {
          'Admin': '#ef4444',
          'Marketing Staff': '#8b5cf6',
          'Sales Staff': '#3b82f6',
          'Customer': '#6b7280',
        };
        return (
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            backgroundColor: `${colors[value]}20`,
            color: colors[value],
          }}>
            {value}
          </span>
        );
      }
    },
    {
      header: 'Status',
      key: 'status',
      render: (value) => (
        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '9999px',
          fontSize: '0.75rem',
          fontWeight: '600',
          backgroundColor: value === 'active' ? '#d1fae5' : '#fee2e2',
          color: value === 'active' ? '#10b981' : '#ef4444',
        }}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </span>
      )
    },
    { header: 'Last Login', key: 'lastLogin' },
    {
      header: 'Actions',
      key: 'id',
      render: (value, row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}>✏️ Edit</button>
          <button style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: 'none', background: 'none', cursor: 'pointer', color: '#f59e0b' }}>
            {row.status === 'active' ? '🚫 Suspend' : '✅ Activate'}
          </button>
          <button style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>🗑️ Delete</button>
        </div>
      )
    }
  ];

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Manage User Accounts</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        Create, update, view, and manage system user accounts
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <SearchBar
            placeholder="Search by name or email..."
            onSearch={setSearchTerm}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-gray-300)',
            fontSize: '0.875rem',
            minWidth: '150px',
          }}
        >
          <option value="all">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Marketing Staff">Marketing Staff</option>
          <option value="Sales Staff">Sales Staff</option>
          <option value="Customer">Customer</option>
        </select>

        <Button>+ Add New User</Button>
      </div>

      <DataTable columns={columns} data={filteredUsers} />
    </div>
  );
}
