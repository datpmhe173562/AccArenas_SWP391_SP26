import { Link } from 'react-router-dom';
import Card, { CardBody } from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function LoginPage() {
  return (
    <div className="container" style={{ maxWidth: '500px', paddingTop: '3rem' }}>
      <Card>
        <CardBody>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>Login to AccArenas</h1>
          <p style={{ textAlign: 'center', color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
            This screen allows the Guest/Customer to authenticate using email and password to access system features
          </p>
          <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <Input label="Email Address" type="email" placeholder="your.email@example.com" icon={<EnvelopeIcon />} required />
            <Input label="Password" type="password" placeholder="Enter your password" icon={<LockClosedIcon />} required />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label><input type="checkbox" /> Remember me</label>
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
            <Button type="submit" fullWidth size="lg">Login</Button>
            <p style={{ textAlign: 'center', fontSize: '0.875rem' }}>
              Don't have an account? <Link to="/register">Register</Link>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
