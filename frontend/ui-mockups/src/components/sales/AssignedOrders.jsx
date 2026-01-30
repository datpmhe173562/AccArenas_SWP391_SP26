import Table from '../common/Table';
import Badge from '../common/Badge';
import Card from '../common/Card';

export default function AssignedOrders() {
  const orders = [
    { id: 'ORD-001', customer: 'John Doe', product: 'League of Legends Diamond II', amount: '$150', status: 'pending', assignedDate: '2026-01-25' },
    { id: 'ORD-002', customer: 'Jane Smith', product: 'Valorant Immortal I', amount: '$200', status: 'processing', assignedDate: '2026-01-24' },
    { id: 'ORD-003', customer: 'Bob Johnson', product: 'Genshin Impact AR 55', amount: '$120', status: 'completed', assignedDate: '2026-01-23' },
  ];

  const columns = [
    { header: 'Order ID', accessor: 'id' },
    { header: 'Customer', accessor: 'customer' },
    { header: 'Product', accessor: 'product' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Assigned Date', accessor: 'assignedDate' },
    { 
      header: 'Status', 
      accessor: 'status',
      render: (row) => <Badge variant={row.status === 'completed' ? 'success' : row.status === 'processing' ? 'warning' : 'info'}>{row.status}</Badge>
    },
  ];

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Assigned Orders</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        This screen allows Sales Staff to view orders assigned to them by the system
      </p>
      <Card>
        <Table columns={columns} data={orders} />
      </Card>
    </div>
  );
}
