import Card, { CardBody, CardHeader } from '../common/Card';

export default function SalesStatistics() {
  const stats = {
    totalOrders: 45,
    completedOrders: 38,
    pendingOrders: 7,
    totalRevenue: '$6,750',
    avgOrderValue: '$150',
    customerSatisfaction: '4.8/5.0'
  };

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Sales Statistics</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        This screen allows Sales Staff to view personal sales performance and statistics
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Total Orders</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.totalOrders}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Completed Orders</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>{stats.completedOrders}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Pending Orders</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-warning)' }}>{stats.pendingOrders}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Total Revenue</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stats.totalRevenue}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Avg Order Value</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.avgOrderValue}</p>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Customer Satisfaction</p>
            <p style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--color-success)' }}>{stats.customerSatisfaction}</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
