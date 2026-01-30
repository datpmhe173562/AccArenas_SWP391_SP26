import React, { useState } from 'react';

export default function ManagePromotionsPage() {
  const [promotions, setPromotions] = useState([
    { id: 1, code: 'WELCOME20', discount: '20%', type: 'Percentage', startDate: '2023-10-01', endDate: '2023-12-31', status: 'Active' },
    { id: 2, code: 'FLASH50', discount: '$50', type: 'Fixed Amount', startDate: '2023-11-10', endDate: '2023-11-12', status: 'Expired' },
    { id: 3, code: 'GAMER10', discount: '10%', type: 'Percentage', startDate: '2023-01-01', endDate: '2023-12-31', status: 'Active' },
  ]);

  return (
    <div className="container" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>Manage Promotions</h1>
        <button style={{
          backgroundColor: '#3B82F6',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          border: 'none',
          fontWeight: '600',
          cursor: 'pointer'
        }}>
          + New Promotion
        </button>
      </div>

      <div style={{ background: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead style={{ background: '#F9FAFB' }}>
            <tr style={{ textAlign: 'left' }}>
              <th style={{ padding: '1rem', color: '#6B7280', fontWeight: '600', fontSize: '0.875rem' }}>Code</th>
              <th style={{ padding: '1rem', color: '#6B7280', fontWeight: '600', fontSize: '0.875rem' }}>Discount</th>
              <th style={{ padding: '1rem', color: '#6B7280', fontWeight: '600', fontSize: '0.875rem' }}>Duration</th>
              <th style={{ padding: '1rem', color: '#6B7280', fontWeight: '600', fontSize: '0.875rem' }}>Status</th>
              <th style={{ padding: '1rem', color: '#6B7280', fontWeight: '600', fontSize: '0.875rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.id} style={{ borderTop: '1px solid #E5E7EB' }}>
                <td style={{ padding: '1rem', fontWeight: '500' }}>{promo.code}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    background: promo.type === 'Percentage' ? '#E0F2FE' : '#ECFDF5',
                    color: promo.type === 'Percentage' ? '#0369A1' : '#047857',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.875rem'
                  }}>
                    {promo.discount}
                  </span>
                </td>
                <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#4B5563' }}>
                  {promo.startDate} - {promo.endDate}
                </td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    background: promo.status === 'Active' ? '#DCFCE7' : '#FEE2E2',
                    color: promo.status === 'Active' ? '#15803D' : '#B91C1C',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: '600'
                  }}>
                    {promo.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button style={{ color: '#4B5563', background: 'none', border: 'none', cursor: 'pointer' }}>Edit</button>
                    <button style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
