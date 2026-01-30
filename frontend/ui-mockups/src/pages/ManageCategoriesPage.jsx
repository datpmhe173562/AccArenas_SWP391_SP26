import React, { useState } from 'react';

export default function ManageCategoriesPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: 'MOBA', description: 'Multiplayer Online Battle Arena', count: 154, status: 'Active' },
    { id: 2, name: 'FPS', description: 'First Person Shooter', count: 89, status: 'Active' },
    { id: 3, name: 'MMORPG', description: 'Massively Multiplayer Online Role-Playing Game', count: 210, status: 'Active' },
    { id: 4, name: 'Gacha', description: 'Gacha Games', count: 320, status: 'Active' },
    { id: 5, name: 'Strategy', description: 'Strategic Planning Games', count: 45, status: 'Inactive' },
  ]);

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Manage Account Categories</h1>
        <button style={{
          backgroundColor: '#F59E0B',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          + Add Category
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#FFF7ED' }}>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: '1.25rem 1.5rem', color: '#92400E', fontWeight: '600' }}>Name</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#92400E', fontWeight: '600' }}>Description</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#92400E', fontWeight: '600' }}>Accounts</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#92400E', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#92400E', fontWeight: '600', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat, index) => (
              <tr key={cat.id} style={{ borderTop: index > 0 ? '1px solid #F3F4F6' : 'none' }}>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: 'bold', color: '#1F2937' }}>{cat.name}</td>
                <td style={{ padding: '1.25rem 1.5rem', color: '#6B7280' }}>{cat.description}</td>
                <td style={{ padding: '1.25rem 1.5rem', fontWeight: '500' }}>{cat.count} listings</td>
                <td style={{ padding: '1.25rem 1.5rem' }}>
                  <span style={{
                    background: cat.status === 'Active' ? '#DCFCE7' : '#F3F4F6',
                    color: cat.status === 'Active' ? '#15803D' : '#374151',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {cat.status}
                  </span>
                </td>
                <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right' }}>
                  <button style={{ color: '#F59E0B', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer', marginRight: '1rem' }}>Edit</button>
                  <button style={{ color: '#EF4444', background: 'none', border: 'none', fontWeight: '600', cursor: 'pointer' }}>Disable</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
