import { Link } from 'react-router-dom';
import Card, { CardBody } from '../components/common/Card';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

export default function ForgotPasswordPage() {
    return (
        <div className="container" style={{ maxWidth: '500px', paddingTop: '3rem' }}>
            <Card>
                <CardBody>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>
                        Reset Your Password
                    </h1>
                    <p style={{ textAlign: 'center', color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
                        Enter your email address and we'll send you a link to reset your password
                    </p>

                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="your.email@example.com"
                            required
                        />

                        <Button type="submit" fullWidth size="lg">
                            Send Reset Link
                        </Button>

                        <p style={{ textAlign: 'center', fontSize: '0.875rem' }}>
                            <Link to="/login">← Back to Login</Link>
                        </p>

                        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                            Didn't receive the email? Check your spam folder or <a href="#" style={{ color: 'var(--color-primary)' }}>resend</a>
                        </p>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
