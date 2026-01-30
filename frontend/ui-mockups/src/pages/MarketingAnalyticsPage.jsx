import React, { useState } from 'react';

export default function MarketingAnalyticsPage() {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Marketing Analytics</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <KpiCard title="Total Revenue" value="$45,231.89" change="+20.1% from last month" color="#10B981" />
        <KpiCard title="Active Users" value="2,350" change="+15% from last month" color="#3B82F6" />
        <KpiCard title="New Signups" value="+573" change="+201 since last week" color="#F59E0B" />
        <KpiCard title="Bounce Rate" value="42.3%" change="-5% from last month" color="#EF4444" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <ChartCard title="Revenue Growth" type="line" />
        <ChartCard title="Traffic Sources" type="bar" />
      </div>

      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Top Performing Products</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem 0' }}>Product Name</th>
              <th style={{ padding: '0.75rem 0' }}>Category</th>
              <th style={{ padding: '0.75rem 0' }}>Sales</th>
              <th style={{ padding: '0.75rem 0' }}>Revenue</th>
            </tr>
          </thead>
          <tbody>
            <ProductRow name="Legendary Warrior Account" category="RPG" sales="120" revenue="$12,000" />
            <ProductRow name="Diamond Rank Smurfs" category="MOBA" sales="85" revenue="$4,250" />
            <ProductRow name="Rare Skin Bundle" category="FPS" sales="200" revenue="$10,000" />
            <ProductRow name="Starter Pack Deluxe" category="Gacha" sales="300" revenue="$3,000" />
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KpiCard({ title, value, change, color }) {
  return (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', borderTop: `4px solid ${color}` }}>
      <h3 style={{ color: '#6B7280', fontSize: '0.875rem', fontWeight: '500' }}>{title}</h3>
      <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{value}</div>
      <div style={{ fontSize: '0.875rem', color: color }}>{change}</div>
    </div>
  );
}

function ChartCard({ title, type }) {
  return (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', height: '300px' }}>
      <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '1rem' }}>{title}</h3>
      <div style={{ height: '80%', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '10px' }}>
        {/* Mock Chart Visuals */}
        {[60, 40, 75, 50, 80, 65, 90].map((h, i) => (
          <div key={i} style={{
            width: '100%',
            background: type === 'line' ? 'none' : '#E5E7EB',
            height: '100%',
            position: 'relative',
            borderRadius: '4px'
          }}>
            <div style={{
              position: 'absolute',
              bottom: 0,
              width: '100%',
              height: `${h}%`,
              background: '#3B82F6',
              borderRadius: '4px 4px 0 0',
              opacity: 0.7
            }}></div>
            {type === 'line' && (
              <div style={{
                position: 'absolute',
                bottom: `${h}%`,
                left: '50%',
                width: '10px',
                height: '10px',
                background: '#3B82F6',
                borderRadius: '50%',
                transform: 'translate(-50%, 50%)'

              }}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductRow({ name, category, sales, revenue }) {
  return (
    <tr style={{ borderBottom: '1px solid #f3f4f6' }}>
      <td style={{ padding: '1rem 0', fontWeight: '500' }}>{name}</td>
      <td style={{ padding: '1rem 0', color: '#6B7280' }}>{category}</td>
      <td style={{ padding: '1rem 0' }}>{sales}</td>
      <td style={{ padding: '1rem 0' }}>{revenue}</td>
    </tr>
  );
}
