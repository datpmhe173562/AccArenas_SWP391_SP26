import { useState } from 'react';
import Table from '../common/Table';
import Button from '../common/Button';
import Card from '../common/Card';

export default function ManageRoles() {
  const [roles] = useState([
    { id: 1, name: 'Admin', description: 'Full system access', userCount: 2 },
    { id: 2, name: 'Sales Staff', description: 'Manage orders and customers', userCount: 5 },
    { id: 3, name: 'Marketing Staff', description: 'Manage products and promotions', userCount: 3 },
    { id: 4, name: 'Customer', description: 'Browse and purchase accounts', userCount: 150 },
  ]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Role Name', accessor: 'name' },
    { header: 'Description', accessor: 'description' },
    { header: 'Users', accessor: 'userCount' },
  ];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Manage Roles</h1>
          <p style={{ color: 'var(--color-gray-600)' }}>
            This screen allows Admin to create, update, delete, and view system roles
          </p>
        </div>
        <Button>+ Add Role</Button>
      </div>
      <Card>
        <Table columns={columns} data={roles} />
      </Card>
    </div>
  );
}
