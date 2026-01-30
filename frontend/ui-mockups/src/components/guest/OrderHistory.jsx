import { Link } from 'react-router-dom';
import Table from '../common/Table';
import Badge from '../common/Badge';
import Card from '../common/Card';

export default function OrderHistory() {
    const orders = [
        { id: 'ORD-001', date: '2026-01-25', product: 'League of Legends Diamond II', amount: '$150', status: 'completed' },
        { id: 'ORD-002', date: '2026-01-20', product: 'Valorant Immortal I', amount: '$200', status: 'completed' },
        { id: 'ORD-003', date: '2026-01-15', product: 'Genshin Impact AR 55', amount: '$120', status: 'processing' },
        { id: 'ORD-004', date: '2026-01-10', product: 'CS:GO Global Elite', amount: '$180', status: 'completed' },
    ];

    const columns = [
        { header: 'Order ID', accessor: 'id', render: (row) => <Link to={`/orders/${row.id}`} style={{ color: 'var(--color-primary)', fontWeight: '600' }}>{row.id}</Link> },
        { header: 'Date', accessor: 'date' },
        { header: 'Product', accessor: 'product' },
        { header: 'Amount', accessor: 'amount', render: (row) => <span style={{ fontWeight: '600' }}>{row.amount}</span> },
        {
            header: 'Status',
            accessor: 'status',
            render: (row) => (
                <Badge variant={row.status === 'completed' ? 'success' : row.status === 'processing' ? 'warning' : 'gray'}>
                    {row.status}
                </Badge>
            )
        },
    ];

    return (
        <div className="container">
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Order History</h1>
            <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
                This screen allows the Customer to view a list of past orders
            </p>

            <Card>
                <Table columns={columns} data={orders} onRowClick={(row) => window.location.href = `/orders/${row.id}`} />
            </Card>
        </div>
    );
}
