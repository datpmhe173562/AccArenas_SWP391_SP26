import { useState } from 'react';
import Card, { CardBody } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Timeline from '../components/common/Timeline';

export default function OrderDetailPage() {
  const [showPassword, setShowPassword] = useState(false);

  const order = {
    id: 'ORD-001',
    date: '2026-01-25',
    status: 'completed',
    product: {
      name: 'League of Legends Diamond II Account',
      game: 'League of Legends',
      rank: 'Diamond II',
      level: 150,
      server: 'NA',
      features: ['100+ Skins', 'All Champions', 'High Honor Level']
    },
    payment: {
      method: 'Credit Card',
      subtotal: 150,
      discount: 0,
      total: 150
    },
    credentials: {
      username: 'summoner_diamond_001',
      password: 'SecurePass123!'
    }
  };

  const timelineEvents = [
    { title: 'Order Placed', date: '2026-01-25 10:00 AM', completed: true, description: 'Your order has been received' },
    { title: 'Payment Confirmed', date: '2026-01-25 10:02 AM', completed: true, description: 'Payment processed successfully' },
    { title: 'Account Prepared', date: '2026-01-25 10:15 AM', completed: true, description: 'Account credentials prepared' },
    { title: 'Credentials Sent', date: '2026-01-25 10:20 AM', completed: true, description: 'Account details sent to your email' },
  ];

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Order Details</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        View detailed information of your order
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Order Summary */}
        <Card>
          <CardBody>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Order #{order.id}</h2>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Placed on {order.date}</p>
              </div>
              <Badge variant={order.status === 'completed' ? 'success' : 'warning'}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
              </Badge>
            </div>
          </CardBody>
        </Card>

        {/* Product Details */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Product Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem' }}>
              <div style={{ height: '150px', backgroundColor: 'var(--color-gray-200)', borderRadius: '0.5rem' }}></div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{order.product.name}</h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Badge variant="primary">{order.product.rank}</Badge>
                  <Badge variant="gray">{order.product.server}</Badge>
                  <Badge variant="gray">Level {order.product.level}</Badge>
                </div>
                <div>
                  <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.25rem' }}>Features:</p>
                  <ul style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginLeft: '1.25rem' }}>
                    {order.product.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Payment Information */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Payment Information</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-gray-600)' }}>Payment Method:</span>
                <span style={{ fontWeight: '600' }}>{order.payment.method}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-gray-600)' }}>Subtotal:</span>
                <span>${order.payment.subtotal}</span>
              </div>
              {order.payment.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Discount:</span>
                  <span>-${order.payment.discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--color-gray-200)', fontSize: '1.125rem', fontWeight: 'bold' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--color-primary)' }}>${order.payment.total}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Account Credentials */}
        {order.status === 'completed' && (
          <Card>
            <CardBody>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Account Credentials</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Username</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type="text"
                      value={order.credentials.username}
                      readOnly
                      style={{ flex: 1, padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-gray-300)', backgroundColor: 'var(--color-gray-50)' }}
                    />
                    <Button size="sm" onClick={() => copyToClipboard(order.credentials.username)}>Copy</Button>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem' }}>Password</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={order.credentials.password}
                      readOnly
                      style={{ flex: 1, padding: '0.75rem', borderRadius: '0.375rem', border: '1px solid var(--color-gray-300)', backgroundColor: 'var(--color-gray-50)' }}
                    />
                    <Button size="sm" variant="secondary" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? 'Hide' : 'Show'}
                    </Button>
                    <Button size="sm" onClick={() => copyToClipboard(order.credentials.password)}>Copy</Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        )}

        {/* Order Timeline */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Order Timeline</h3>
            <Timeline events={timelineEvents} />
          </CardBody>
        </Card>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Button>Leave Feedback</Button>
          <Button variant="secondary">Download Invoice</Button>
          <Button variant="secondary">Need Help?</Button>
          {order.status === 'completed' && (
            <Button variant="danger">Request Refund</Button>
          )}
        </div>
      </div>
    </div>
  );
}
