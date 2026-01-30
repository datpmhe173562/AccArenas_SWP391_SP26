import { useState } from 'react';
import { EnvelopeIcon } from '@heroicons/react/24/outline';
import Input from '../common/Input';
import Button from '../common/Button';
import Card, { CardBody } from '../common/Card';
import './ForgotPassword.css';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Reset password for:', email);
        setSubmitted(true);
    };

    return (
        <div className="forgot-password-container">
            <Card className="forgot-password-card">
                <CardBody>
                    <div className="forgot-password-header">
                        <h1 className="forgot-password-title">Forgot Password</h1>
                        <p className="forgot-password-subtitle">
                            This screen allows the Guest/Customer to request a password reset link sent to their registered email
                        </p>
                    </div>

                    {!submitted ? (
                        <form onSubmit={handleSubmit} className="forgot-password-form">
                            <Input
                                label="Email Address"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your registered email"
                                icon={<EnvelopeIcon />}
                                required
                            />

                            <div className="info-text">
                                <p>Reset link valid for 24 hours</p>
                                <p>Check spam folder if email not received</p>
                                <p>Link can only be used once</p>
                            </div>

                            <Button type="submit" fullWidth size="lg">
                                Send Reset Link
                            </Button>

                            <p className="back-link">
                                <a href="/login">Back to Login</a>
                            </p>
                        </form>
                    ) : (
                        <div className="success-message">
                            <div className="success-icon">✓</div>
                            <h2>Reset Link Sent!</h2>
                            <p>We've sent a password reset link to <strong>{email}</strong></p>
                            <p>Please check your inbox and follow the instructions.</p>
                            <Button onClick={() => window.location.href = '/login'} fullWidth>
                                Back to Login
                            </Button>
                        </div>
                    )}
                </CardBody>
            </Card>
        </div>
    );
}
