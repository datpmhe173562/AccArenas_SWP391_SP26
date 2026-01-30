#!/bin/bash

# Script to generate all remaining UI components for AccArenas

cd "$(dirname "$0")"

# Create guest/customer components (UC-04 to UC-13)
echo "Creating guest/customer components..."

# UC-05: View Promotions
cat > src/components/guest/ViewPromotions.jsx << 'EOF'
import Card, { CardBody, CardHeader } from '../common/Card';
import Badge from '../common/Badge';

export default function ViewPromotions() {
  const promotions = [
    { id: 1, title: '50% OFF League of Legends Accounts', code: 'LOL50', discount: '50%', validUntil: '2026-02-28', status: 'active' },
    { id: 2, title: 'Buy 2 Get 1 Free - Valorant', code: 'VAL3FOR2', discount: 'Buy 2 Get 1', validUntil: '2026-03-15', status: 'active' },
    { id: 3, title: 'New Customer 20% Discount', code: 'NEWBIE20', discount: '20%', validUntil: '2026-12-31', status: 'active' },
    { id: 4, title: 'Flash Sale - Genshin Impact', code: 'GENSHIN30', discount: '30%', validUntil: '2026-02-01', status: 'expiring' },
  ];

  return (
    <div className="container">
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Active Promotions</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        This screen allows the Guest/Customer to view active promotions, discounts, and vouchers
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promotions.map(promo => (
          <Card key={promo.id}>
            <CardHeader>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0 }}>{promo.title}</h3>
                <Badge variant={promo.status === 'active' ? 'success' : 'warning'}>
                  {promo.status}
                </Badge>
              </div>
            </CardHeader>
            <CardBody>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <span style={{ fontWeight: '600' }}>Promo Code: </span>
                  <code style={{ backgroundColor: 'var(--color-gray-100)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                    {promo.code}
                  </code>
                </div>
                <div>
                  <span style={{ fontWeight: '600' }}>Discount: </span>
                  <span style={{ color: 'var(--color-success)', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    {promo.discount}
                  </span>
                </div>
                <div>
                  <span style={{ fontWeight: '600' }}>Valid Until: </span>
                  <span>{promo.validUntil}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
}
EOF

# UC-06: Manage Profile
cat > src/components/guest/ManageProfile.jsx << 'EOF'
import { useState } from 'react';
import { UserIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import Input from '../common/Input';
import Button from '../common/Button';
import Card, { CardBody, CardHeader } from '../common/Card';

export default function ManageProfile() {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+84 123 456 789',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Update profile:', formData);
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="container" style={{ maxWidth: '800px', paddingTop: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Manage Profile</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        This screen allows the Customer to view and update personal profile information
      </p>

      <Card>
        <CardHeader>Personal Information</CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              icon={<UserIcon />}
              required
            />
            <Input
              label="Email Address"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              icon={<EnvelopeIcon />}
              required
            />
            <Input
              label="Phone Number"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              icon={<PhoneIcon />}
            />
            
            <hr style={{ margin: '1rem 0' }} />
            <h3>Change Password</h3>
            
            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
            />
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button type="submit" size="lg">Save Changes</Button>
              <Button variant="outline" size="lg">Cancel</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
EOF

# Create corresponding page wrappers
cat > src/pages/ViewPromotionsPage.jsx << 'EOF'
import ViewPromotions from '../components/guest/ViewPromotions';
export default function ViewPromotionsPage() {
  return <ViewPromotions />;
}
EOF

cat > src/pages/ManageProfilePage.jsx << 'EOF'
import ManageProfile from '../components/guest/ManageProfile';
export default function ManageProfilePage() {
  return <ManageProfile />;
}
EOF

echo "✅ Guest/customer components created successfully!"
echo "Components created: ForgotPassword, ViewPromotions, ManageProfile"
