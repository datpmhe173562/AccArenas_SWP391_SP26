import { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import DataTable from '../components/common/DataTable';
import Button from '../components/common/Button';

export default function ManageProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const products = [
    { id: 1, name: 'League of Legends Diamond II', game: 'League of Legends', rank: 'Diamond II', price: 150, status: 'active' },
    { id: 2, name: 'Valorant Immortal I', game: 'Valorant', rank: 'Immortal I', price: 200, status: 'active' },
    { id: 3, name: 'Genshin Impact AR 55', game: 'Genshin Impact', rank: 'AR 55', price: 120, status: 'active' },
    { id: 4, name: 'CS:GO Global Elite', game: 'CS:GO', rank: 'Global Elite', price: 180, status: 'inactive' },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.game.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { header: 'Image', key: 'id', render: () => <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--color-gray-200)', borderRadius: '0.25rem' }}></div> },
    { header: 'Name', key: 'name' },
    { header: 'Game', key: 'game' },
    { header: 'Rank', key: 'rank' },
    { header: 'Price', key: 'price', render: (value) => `$${value}` },
    {
      header: 'Status',
      key: 'status',
      render: (value) => (
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input type="checkbox" checked={value === 'active'} onChange={() => { }} style={{ marginRight: '0.5rem' }} />
          <span style={{ fontSize: '0.875rem', color: value === 'active' ? '#10b981' : 'var(--color-gray-500)' }}>
            {value === 'active' ? 'Active' : 'Inactive'}
          </span>
        </label>
      )
    },
    {
      header: 'Actions',
      key: 'id',
      render: (value) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', border: 'none', background: 'none', cursor: 'pointer', color: 'var(--color-primary)' }}>✏️ Edit</button>
          <button style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem', border: 'none', background: 'none', cursor: 'pointer', color: '#ef4444' }}>🗑️ Delete</button>
        </div>
      )
    }
  ];

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Manage Product Listings</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        Create, update, and view game account product listings
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <SearchBar
            placeholder="Search products by name or game..."
            onSearch={setSearchTerm}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-gray-300)',
            fontSize: '0.875rem',
            minWidth: '150px',
          }}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>

        <Button>+ Add New Product</Button>
      </div>

      <DataTable columns={columns} data={filteredProducts} />
    </div>
  );
}
