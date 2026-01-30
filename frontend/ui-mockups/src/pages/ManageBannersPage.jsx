import React from 'react';

export default function ManageBannersPage() {
  const banners = [
    { id: 1, name: 'Holiday Special', image: 'https://via.placeholder.com/300x150', status: 'Active', position: 'Top' },
    { id: 2, name: 'New Arrivals', image: 'https://via.placeholder.com/300x150', status: 'Inactive', position: 'Sidebar' },
    { id: 3, name: 'Game Launch', image: 'https://via.placeholder.com/300x150', status: 'Active', position: 'Bottom' },
  ];

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Manage Banners</h1>
        <button style={{
          backgroundColor: '#10B981',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Upload Banner
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {banners.map(banner => (
          <div key={banner.id} style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            overflow: 'hidden',
            border: '1px solid #E5E7EB'
          }}>
            <img src={banner.image} alt={banner.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{banner.name}</h3>
                  <p style={{ color: '#6B7280', fontSize: '0.875rem' }}>Position: {banner.position}</p>
                </div>
                <span style={{
                  background: banner.status === 'Active' ? '#DCFCE7' : '#F3F4F6',
                  color: banner.status === 'Active' ? '#15803D' : '#374151',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  fontSize: '0.75rem',
                  fontWeight: '600'
                }}>
                  {banner.status}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid #F3F4F6', paddingTop: '1rem' }}>
                <button style={{ flex: 1, color: '#4B5563', background: '#F9FAFB', border: '1px solid #D1D5DB', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}>Edit</button>
                <button style={{ flex: 1, color: 'white', background: '#EF4444', border: 'none', padding: '0.5rem', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
