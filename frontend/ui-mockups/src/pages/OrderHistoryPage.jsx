import { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';

export default function OrderHistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    { id: 'ORD-001', date: '2026-01-25', product: 'League of Legends Diamond II', amount: '$150', status: 'completed' },
    { id: 'ORD-002', date: '2026-01-20', product: 'Valorant Immortal I', amount: '$200', status: 'completed' },
    { id: 'ORD-003', date: '2026-01-15', product: 'Genshin Impact AR 55', amount: '$120', status: 'processing' },
    { id: 'ORD-004', date: '2026-01-10', product: 'CS:GO Global Elite', amount: '$180', status: 'completed' },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      header: 'Order ID',
      key: 'id',
      render: (value) => <a href={`/orders/${value}`} style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{value}</a>
    },
    { header: 'Date', key: 'date' },
    { header: 'Product', key: 'product' },
    { header: 'Amount', key: 'amount' },
    {
      header: 'Status',
      key: 'status',
      render: (value) => {
        const variants = {
          completed: { color: '#10b981', bg: '#d1fae5', text: 'Completed' },
          processing: { color: '#f59e0b', bg: '#fef3c7', text: 'Processing' },
          cancelled: { color: '#ef4444', bg: '#fee2e2', text: 'Cancelled' },
        };
        const variant = variants[value] || variants.processing;
        return (
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: '600',
            backgroundColor: variant.bg,
            color: variant.color,
          }}>
            {variant.text}
          </span>
        );
      }
    },
    {
      header: 'Actions',
      key: 'id',
      render: (value) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => window.location.href = `/orders/${value}`}
            style={{
              padding: '0.25rem 0.75rem',
              fontSize: '0.75rem',
              borderRadius: '0.25rem',
              border: '1px solid var(--color-primary)',
              color: 'var(--color-primary)',
              backgroundColor: 'white',
              cursor: 'pointer',
            }}
          >
            View Details
          </button>
          <button
            style={{
              padding: '0.25rem',
              fontSize: '0.75rem',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--color-gray-600)',
            }}
            title="Download Invoice"
          >
            📄
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Order History</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        This screen allows the Customer to view a list of past orders
      </p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <SearchBar
            placeholder="Search by order ID or product name..."
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
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <DataTable columns={columns} data={filteredOrders} />
    </div>
  );
}
