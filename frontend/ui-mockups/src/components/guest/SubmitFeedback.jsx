import { useState } from 'react';
import StarRating from '../common/StarRating';
import Input from '../common/Input';
import Button from '../common/Button';
import Card, { CardBody, CardHeader } from '../common/Card';

export default function SubmitFeedback() {
    const [formData, setFormData] = useState({
        orderId: '',
        rating: 0,
        title: '',
        comment: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Feedback submitted:', formData);
    };

    return (
        <div className="container" style={{ maxWidth: '700px', paddingTop: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Submit Feedback</h1>
            <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
                This screen allows the Customer to submit feedback or reviews for purchased accounts
            </p>

            <Card>
                <CardHeader>Your Feedback</CardHeader>
                <CardBody>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Input
                            label="Order ID"
                            value={formData.orderId}
                            onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                            placeholder="Enter your order ID (e.g., ORD-001)"
                            required
                        />

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Rating <span style={{ color: 'var(--color-danger)' }}>*</span>
                            </label>
                            <StarRating
                                rating={formData.rating}
                                onChange={(rating) => setFormData({ ...formData, rating })}
                                size="lg"
                            />
                        </div>

                        <Input
                            label="Review Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Summarize your experience"
                            required
                        />

                        <div>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Your Review <span style={{ color: 'var(--color-danger)' }}>*</span>
                            </label>
                            <textarea
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                placeholder="Share your experience with this account..."
                                required
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '0.625rem 1rem',
                                    fontSize: '1rem',
                                    border: '1px solid var(--color-gray-300)',
                                    borderRadius: 'var(--radius-md)',
                                    fontFamily: 'inherit'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Button type="submit" size="lg">Submit Feedback</Button>
                            <Button variant="outline" size="lg" onClick={() => window.history.back()}>Cancel</Button>
                        </div>
                    </form>
                </CardBody>
            </Card>
        </div>
    );
}
