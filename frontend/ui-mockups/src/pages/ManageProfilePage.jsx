import { useState } from 'react';
import Card, { CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function ManageProfilePage() {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 8900',
    address: '123 Main St, City, Country',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const stats = {
    totalOrders: 12,
    totalPurchases: 1850,
    feedbackSubmitted: 8,
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>My Profile</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        View and update your personal profile information
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Account Statistics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {[
            { label: 'Total Orders', value: stats.totalOrders, icon: '📦' },
            { label: 'Total Purchases', value: `$${stats.totalPurchases}`, icon: '💰' },
            { label: 'Feedback Submitted', value: stats.feedbackSubmitted, icon: '⭐' },
          ].map((stat, index) => (
            <div key={index} style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{stat.icon}</div>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginBottom: '0.25rem' }}>{stat.label}</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)' }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Personal Information */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Personal Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Profile Picture
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>
                    👤
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png"
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.375rem',
                      border: '1px solid var(--color-gray-300)',
                      fontSize: '0.875rem',
                    }}
                  />
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>Max 2MB</span>
                </div>
              </div>

              <Input
                label="Full Name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />

              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                disabled
                style={{ backgroundColor: 'var(--color-gray-100)', cursor: 'not-allowed' }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '-0.5rem' }}>
                Email cannot be changed
              </p>

              <Input
                label="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--color-gray-300)',
                    fontSize: '0.875rem',
                    resize: 'vertical',
                  }}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Change Password */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Change Password</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                label="Current Password"
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                placeholder="Enter current password"
              />

              <Input
                label="New Password"
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                placeholder="Min 8 chars, 1 uppercase, 1 number"
              />

              <Input
                label="Confirm New Password"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="Re-enter new password"
              />

              {formData.newPassword && (
                <div style={{ padding: '0.75rem', backgroundColor: '#f0f9ff', borderRadius: '0.375rem', fontSize: '0.875rem' }}>
                  <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Password Strength: Medium</p>
                  <div style={{ height: '4px', backgroundColor: '#e5e7eb', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: '60%', backgroundColor: '#f59e0b' }}></div>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
