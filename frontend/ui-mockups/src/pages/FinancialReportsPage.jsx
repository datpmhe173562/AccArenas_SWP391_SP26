import MetricCard from '../components/common/MetricCard';
import Button from '../components/common/Button';

export default function FinancialReportsPage() {
  const stats = {
    totalRevenue: 125000,
    totalOrders: 850,
    avgOrderValue: 147,
    refundRate: 2.3,
  };

  const categoryRevenue = [
    { category: 'League of Legends', revenue: 45000, orders: 300 },
    { category: 'Valorant', revenue: 38000, orders: 190 },
    { category: 'Genshin Impact', revenue: 22000, orders: 183 },
    { category: 'CS:GO', revenue: 15000, orders: 125 },
    { category: 'Dota 2', revenue: 5000, orders: 52 },
  ];

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Financial Reports</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        View system-wide financial and revenue reports
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
          <option>This Week</option>
          <option selected>This Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
          <option>Custom Range</option>
        </select>
        <Button variant="secondary">📥 Export Report</Button>
      </div>

      {/* Key Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <MetricCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          color="success"
          trend={{ positive: true, value: '+15% from last month' }}
          icon={<span style={{ fontSize: '1.5rem' }}>💰</span>}
        />
        <MetricCard
          title="Total Orders"
          value={stats.totalOrders}
          color="primary"
          trend={{ positive: true, value: '+8% from last month' }}
          icon={<span style={{ fontSize: '1.5rem' }}>📦</span>}
        />
        <MetricCard
          title="Avg Order Value"
          value={`$${stats.avgOrderValue}`}
          color="warning"
          trend={{ positive: true, value: '+5% from last month' }}
          icon={<span style={{ fontSize: '1.5rem' }}>📊</span>}
        />
        <MetricCard
          title="Refund Rate"
          value={`${stats.refundRate}%`}
          color="danger"
          trend={{ positive: false, value: '-0.5% from last month' }}
          icon={<span style={{ fontSize: '1.5rem' }}>↩️</span>}
        />
      </div>

      {/* Revenue Chart */}
      <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Revenue Trend</h3>
        <div style={{ height: '300px', backgroundColor: 'var(--color-gray-50)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-500)' }}>
          📈 Line Chart - Revenue over time
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Payment Breakdown */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Payment Method Breakdown</h3>
          <div style={{ height: '250px', backgroundColor: 'var(--color-gray-50)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-500)' }}>
            🥧 Pie Chart - Payment methods
          </div>
        </div>

        {/* Revenue by Category */}
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', padding: '1.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Revenue by Category</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {categoryRevenue.map((item, index) => {
              const percentage = (item.revenue / stats.totalRevenue * 100).toFixed(1);
              return (
                <div key={index}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.875rem' }}>
                    <span>{item.category}</span>
                    <span style={{ fontWeight: '600' }}>${item.revenue.toLocaleString()}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: 'var(--color-gray-200)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${percentage}%`, backgroundColor: 'var(--color-primary)', transition: 'width 0.3s' }}></div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>
                    {item.orders} orders ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
