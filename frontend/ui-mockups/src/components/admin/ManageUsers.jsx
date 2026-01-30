import { useState } from 'react';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

export default function ManageUsers() {
  const [users] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Customer', status: 'active', createdAt: '2026-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Sales Staff', status: 'active', createdAt: '2026-01-10' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Marketing Staff', status: 'inactive', createdAt: '2026-01-05' },
  ]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Name', accessor: 'name' },
    { header: 'Email', accessor: 'email' },
    { header: 'Role', accessor: 'role' },
    { header: 'Created At', accessor: 'createdAt' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <Badge variant={row.status === 'active' ? 'success' : 'gray'}>{row.status}</Badge>
    },
  ];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Manage Users</h1>
          <p style={{ color: 'var(--color-gray-600)' }}>
            This screen allows Admin to create, update, view, and manage system user accounts
          </p>
        </div>
        <Button>+ Add User</Button>
      </div>
      <Card>
        <Table columns={columns} data={users} />
      </Card>
    </div>
  );
}
