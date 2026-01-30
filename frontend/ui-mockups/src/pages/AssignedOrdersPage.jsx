import { useState } from 'react';
import SearchBar from '../components/common/SearchBar';
import DataTable from '../components/common/DataTable';
import Badge from '../components/common/Badge';

export default function AssignedOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const orders = [
    { id: 'ORD-101', customer: 'John Doe', product: 'League of Legends Diamond II', status: 'new', priority: 'high', assignedDate: '2026-01-29' },
    { id: 'ORD-102', customer: 'Jane Smith', product: 'Valorant Immortal I', status: 'in-progress', priority: 'medium', assignedDate: '2026-01-28' },
    { id: 'ORD-103', customer: 'Bob Johnson', product: 'Genshin Impact AR 55', status: 'completed', priority: 'low', assignedDate: '2026-01-27' },
    { id: 'ORD-104', customer: 'Alice Brown', product: 'CS:GO Global Elite', status: 'new', priority: 'high', assignedDate: '2026-01-29' },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || order.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const statusVariants = {
    new: { color: '#3b82f6', bg: '#dbeafe', text: 'New' },
    'in-progress': { color: '#f59e0b', bg: '#fef3c7', text: 'In Progress' },
    completed: { color: '#10b981', bg: '#d1fae5', text: 'Completed' },
  };

  const priorityVariants = {
    high: { color: '#ef4444', bg: '#fee2e2', text: 'High' },
    medium: { color: '#f59e0b', bg: '#fef3c7', text: 'Medium' },
    low: { color: '#6b7280', bg: '#f3f4f6', text: 'Low' },
  };

  const columns = [
    {
      header: 'Order ID',
      key: 'id',
      render: (value) => <a href={`/sales/orders/${value}`} style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{value}</a>
    },
    { header: 'Customer', key: 'customer' },
    { header: 'Product', key: 'product' },
    {
      header: 'Status',
      key: 'status',
      render: (value) => {
        const variant = statusVariants[value];
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
      header: 'Priority',
      key: 'priority',
      render: (value) => {
        const variant = priorityVariants[value];
        return (
          <span style={{
            padding: '0.25rem 0.75rem',
            borderRadius: '0.25rem',
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
    { header: 'Assigned Date', key: 'assignedDate' },
    {
      header: 'Actions',
      key: 'id',
      render: (value, row) => (
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={() => window.location.href = `/sales/orders/${value}`}
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
            title="Contact Customer"
          >
            ✉️
          </button>
        </div>
      )
    }
  ];

  const stats = {
    total: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    inProgress: orders.filter(o => o.status === 'in-progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>My Assigned Orders</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        View and manage orders assigned to you by the system
      </p>

      {/* Statistics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        {[
          { label: 'Total Assigned', value: stats.total, color: '#3b82f6' },
          { label: 'New', value: stats.new, color: '#3b82f6' },
          { label: 'In Progress', value: stats.inProgress, color: '#f59e0b' },
          { label: 'Completed', value: stats.completed, color: '#10b981' },
        ].map((stat, index) => (
          <div key={index} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '0.5rem' }}>{stat.label}</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: stat.color }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <SearchBar
            placeholder="Search by order ID, customer, or product..."
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
          <option value="new">New</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-gray-300)',
            fontSize: '0.875rem',
            minWidth: '150px',
          }}
        >
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <DataTable columns={columns} data={filteredOrders} />
    </div>
  );
}
