import React, { useState } from 'react';

export default function ReassignRolePage() {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', currentRole: 'Customer', avatar: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Alice Smith', email: 'alice.mrkt@example.com', currentRole: 'Marketing Staff', avatar: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Bob Wilson', email: 'bob.sales@example.com', currentRole: 'Sales Staff', avatar: 'https://via.placeholder.com/40' },
  ];

  const roles = ['Customer', 'Marketing Staff', 'Sales Staff', 'Admin'];

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>Re-assign User Role</h1>
      <p style={{ textAlign: 'center', color: '#6B7280', marginBottom: '2rem' }}>Search for a user to modify their system access and permissions.</p>

      <div style={{ marginBottom: '2rem', position: 'relative' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem',
            paddingLeft: '3rem',
            borderRadius: '50px',
            border: '1px solid #D1D5DB',
            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
            fontSize: '1rem'
          }}
        />
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }}>🔍</span>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {users.map((user, index) => (
          <div key={user.id} style={{
            padding: '1.5rem',
            borderBottom: index < users.length - 1 ? '1px solid #F3F4F6' : 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <img src={user.avatar} alt={user.name} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '0.25rem' }}>{user.name}</h3>
              <p style={{ color: '#6B7280', fontSize: '0.9rem' }}>{user.email}</p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>Current Role</p>
                <span style={{ fontWeight: '500', color: '#374151' }}>{user.currentRole}</span>
              </div>

              <span style={{ color: '#D1D5DB' }}>→</span>

              <div>
                <p style={{ fontSize: '0.75rem', color: '#6B7280', marginBottom: '0.25rem' }}>New Role</p>
                <select style={{
                  padding: '0.5rem',
                  borderRadius: '6px',
                  border: '1px solid #D1D5DB',
                  background: 'white',
                  cursor: 'pointer'
                }}>
                  {roles.map(role => (
                    <option key={role} selected={role === user.currentRole}>{role}</option>
                  ))}
                </select>
              </div>

              <button style={{
                marginLeft: '1rem',
                background: '#3B82F6',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Save
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
