import { useState } from 'react';
import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/24/outline';
import Input from '../common/Input';
import Button from '../common/Button';
import Card, { CardBody } from '../common/Card';
import './RegisterForm.css';

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register:', formData);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    return (
        <div className="register-container">
            <Card className="register-card">
                <CardBody>
                    <div className="register-header">
                        <h1 className="register-title">Register Account</h1>
                        <p className="register-subtitle">
                            This screen allows the Guest to create a new account by providing personal information and verifying via email
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="register-form">
                        <Input
                            label="Full Name"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            placeholder="Enter your full name"
                            icon={<UserIcon />}
                            required
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            icon={<EnvelopeIcon />}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Min 8 chars, 1 uppercase, 1 number"
                            icon={<LockClosedIcon />}
                            required
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Re-enter your password"
                            icon={<LockClosedIcon />}
                            required
                        />



                        <div className="checkbox-group">
                            <input
                                type="checkbox"
                                id="agreeTerms"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="agreeTerms">
                                I agree to <a href="/terms">Terms & Conditions</a>
                            </label>
                        </div>

                        <Button type="submit" fullWidth size="lg">
                            Register
                        </Button>

                        <p className="login-link">
                            Already have an account? <a href="/login">Login</a>
                        </p>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
