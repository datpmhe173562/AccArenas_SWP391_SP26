import { useState } from 'react';
import Card, { CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'AccArenas',
    contactEmail: 'support@accarenas.com',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUsername: 'noreply@accarenas.com',
    smtpPassword: '',
    paymentGateway: 'stripe',
    apiKey: '',
    minPasswordLength: '8',
    sessionTimeout: '30',
    maintenanceMode: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Settings saved successfully!');
  };

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>System Configuration</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        Configure system parameters and operational settings
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* General Settings */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>General Settings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Input
                label="Site Name"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
              <Input
                label="Contact Email"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Site Logo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--color-gray-300)',
                  }}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Email Settings */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Email Settings (SMTP)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="SMTP Host"
                value={settings.smtpHost}
                onChange={(e) => setSettings({ ...settings, smtpHost: e.target.value })}
              />
              <Input
                label="SMTP Port"
                type="number"
                value={settings.smtpPort}
                onChange={(e) => setSettings({ ...settings, smtpPort: e.target.value })}
              />
              <Input
                label="SMTP Username"
                value={settings.smtpUsername}
                onChange={(e) => setSettings({ ...settings, smtpUsername: e.target.value })}
              />
              <Input
                label="SMTP Password"
                type="password"
                value={settings.smtpPassword}
                onChange={(e) => setSettings({ ...settings, smtpPassword: e.target.value })}
                placeholder="••••••••"
              />
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Button variant="secondary" size="sm">📧 Send Test Email</Button>
            </div>
          </CardBody>
        </Card>

        {/* Payment Gateway */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Payment Gateway</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Payment Provider
                </label>
                <select
                  value={settings.paymentGateway}
                  onChange={(e) => setSettings({ ...settings, paymentGateway: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.375rem',
                    border: '1px solid var(--color-gray-300)',
                  }}
                >
                  <option value="stripe">Stripe</option>
                  <option value="paypal">PayPal</option>
                  <option value="vnpay">VNPay</option>
                </select>
              </div>
              <Input
                label="API Key"
                type="password"
                value={settings.apiKey}
                onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                placeholder="Enter payment gateway API key"
              />
            </div>
          </CardBody>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Security Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Input
                label="Minimum Password Length"
                type="number"
                value={settings.minPasswordLength}
                onChange={(e) => setSettings({ ...settings, minPasswordLength: e.target.value })}
              />
              <Input
                label="Session Timeout (minutes)"
                type="number"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
              />
            </div>
          </CardBody>
        </Card>

        {/* Maintenance Mode */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Maintenance Mode</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', backgroundColor: settings.maintenanceMode ? '#fee2e2' : '#f3f4f6', borderRadius: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                  style={{ marginRight: '0.5rem', width: '1.25rem', height: '1.25rem' }}
                />
                <span style={{ fontWeight: '600', color: settings.maintenanceMode ? '#ef4444' : 'var(--color-gray-700)' }}>
                  {settings.maintenanceMode ? '🚧 Maintenance Mode Enabled' : 'Enable Maintenance Mode'}
                </span>
              </label>
            </div>
            {settings.maintenanceMode && (
              <p style={{ fontSize: '0.875rem', color: '#ef4444', marginTop: '0.5rem' }}>
                ⚠️ Warning: Site will be inaccessible to users when maintenance mode is enabled
              </p>
            )}
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <Button variant="secondary">Cancel</Button>
          <Button type="submit">💾 Save Settings</Button>
        </div>
      </form>
    </div>
  );
}
