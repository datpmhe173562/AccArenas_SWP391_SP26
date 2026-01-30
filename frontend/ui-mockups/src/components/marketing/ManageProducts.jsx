import { useState } from 'react';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Card from '../common/Card';

export default function ManageProducts() {
  const [products] = useState([
    { id: 1, name: 'League of Legends Diamond II', category: 'MOBA', price: '$150', stock: 5, status: 'active' },
    { id: 2, name: 'Valorant Immortal I', category: 'FPS', price: '$200', stock: 3, status: 'active' },
    { id: 3, name: 'Genshin Impact AR 55', category: 'RPG', price: '$120', stock: 0, status: 'out_of_stock' },
  ]);

  const columns = [
    { header: 'ID', accessor: 'id' },
    { header: 'Product Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Price', accessor: 'price' },
    { header: 'Stock', accessor: 'stock' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <Badge variant={row.status === 'active' ? 'success' : 'danger'}>{row.status}</Badge>
    },
  ];

  return (
    <div className="container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Manage Products</h1>
          <p style={{ color: 'var(--color-gray-600)' }}>
            This screen allows Marketing Staff to create, update, and view game account product listings
          </p>
        </div>
        <Button>+ Add Product</Button>
      </div>
      <Card>
        <Table columns={columns} data={products} />
      </Card>
    </div>
  );
}
