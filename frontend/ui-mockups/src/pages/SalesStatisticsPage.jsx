import MetricCard from '../components/common/MetricCard';
import Button from '../components/common/Button';

export default function SalesStatisticsPage() {
  const stats = {
    totalOrders: 45,
    totalRevenue: 6750,
    completionRate: 95.6,
    avgOrderValue: 150,
  };

  const topProducts = [
    { name: 'League of Legends Diamond II', sales: 12, revenue: 1800 },
    { name: 'Valorant Immortal I', sales: 10, revenue: 2000 },
    { name: 'CS:GO Global Elite', sales: 8, revenue: 1440 },
    { name: 'Genshin Impact AR 55', sales: 7, revenue: 840 },
    { name: 'Dota 2 Divine Account', sales: 5, revenue: 800 },
  ];

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>My Sales Performance</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        View your personal sales performance and statistics
      </p>

      {/* Period Selector */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <select
          style={{
            padding: '0.75rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--color-gray-300)',
            fontSize: '0.875rem',
          }}
        >
          <option>Today</option>
          <option selected>This Week</option>
          <option>This Month</option>
          <option>This Year</option>
          <option>Custom Range</option>
        </select>
        <Button variant="secondary">Export Report</Button>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <MetricCard
          title="Total Orders"
          value={stats.totalOrders}
          color="primary"
          trend={{ positive: true, value: '+12% from last week' }}
          icon={<span style={{ fontSize: '1.5rem' }}>📦</span>}
        />
        <MetricCard
          title="Total Revenue"
          value={`$${stats.totalRevenue}`}
          color="success"
          trend={{ positive: true, value: '+8% from last week' }}
          icon={<span style={{ fontSize: '1.5rem' }}>💰</span>}
        />
        <MetricCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          color="primary"
          trend={{ positive: true, value: '+2.3% from last week' }}
          icon={<span style={{ fontSize: '1.5rem' }}>✅</span>}
        />
        <MetricCard
          title="Avg Order Value"
          value={`$${stats.avgOrderValue}`}
          color="warning"
          icon={<span style={{ fontSize: '1.5rem' }}>📊</span>}
        />
      </div>

      {/* Sales Chart Placeholder */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Sales Trend</h3>
        <div style={{ height: '300px', backgroundColor: 'var(--color-gray-50)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-500)' }}>
          📈 Chart Placeholder - Sales over time
        </div>
      </div>

      {/* Top Products */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Top Selling Products</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-gray-200)' }}>
              <th style={{ padding: '0.75rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-gray-700)', textTransform: 'uppercase' }}>Product</th>
              <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-gray-700)', textTransform: 'uppercase' }}>Sales</th>
              <th style={{ padding: '0.75rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-gray-700)', textTransform: 'uppercase' }}>Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((product, index) => (
              <tr key={index} style={{ borderBottom: '1px solid var(--color-gray-200)' }}>
                <td style={{ padding: '1rem', fontSize: '0.875rem' }}>{product.name}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', textAlign: 'right' }}>{product.sales}</td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', textAlign: 'right', fontWeight: '600', color: 'var(--color-primary)' }}>${product.revenue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
