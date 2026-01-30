import React from 'react';

export default function ManageSlidersPage() {
  const sliders = [
    { id: 1, title: 'Summer Gaming Festival', image: 'https://via.placeholder.com/800x400', order: 1, status: 'Active' },
    { id: 2, title: 'New CS:GO Skins', image: 'https://via.placeholder.com/800x400', order: 2, status: 'Active' },
    { id: 3, title: 'Limited Time Offer', image: 'https://via.placeholder.com/800x400', order: 3, status: 'Inactive' },
  ];

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Manage Homepage Sliders</h1>
        <button style={{
          backgroundColor: '#EC4899',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          Add New Slide
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {sliders.sort((a, b) => a.order - b.order).map(slide => (
          <div key={slide.id} style={{
            display: 'flex',
            background: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: '1px solid #E5E7EB'
          }}>
            <div style={{ width: '200px', height: '120px' }}>
              <img src={slide.image} alt={slide.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>{slide.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ color: '#6B7280' }}>Order: <strong>{slide.order}</strong></span>
                  <span style={{
                    background: slide.status === 'Active' ? '#DCFCE7' : '#F3F4F6',
                    color: slide.status === 'Active' ? '#15803D' : '#374151',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {slide.status}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button style={{ border: '1px solid #ddd', background: 'white', cursor: 'pointer', borderRadius: '4px' }}>▲</button>
                  <button style={{ border: '1px solid #ddd', background: 'white', cursor: 'pointer', borderRadius: '4px' }}>▼</button>
                </div>
                <button style={{ padding: '0.5rem 1rem', border: '1px solid #D1D5DB', borderRadius: '6px', background: 'white', cursor: 'pointer' }}>Edit</button>
                <button style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '6px', background: '#EF4444', color: 'white', cursor: 'pointer' }}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
