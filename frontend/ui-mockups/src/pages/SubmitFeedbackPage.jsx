import { useState } from 'react';
import Card, { CardBody } from '../components/common/Card';
import Button from '../components/common/Button';
import StarRating from '../components/common/StarRating';

export default function SubmitFeedbackPage() {
  const [formData, setFormData] = useState({
    orderId: '',
    rating: 0,
    title: '',
    review: '',
    recommend: false,
  });

  const orders = [
    { id: 'ORD-001', product: 'League of Legends Diamond II' },
    { id: 'ORD-002', product: 'Valorant Immortal I' },
    { id: 'ORD-004', product: 'CS:GO Global Elite' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Feedback submitted:', formData);
    alert('Thank you for your feedback!');
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Leave Feedback</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        Share your experience with your purchased account
      </p>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Order Selection */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Select Order <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--color-gray-300)',
                  fontSize: '0.875rem',
                }}
              >
                <option value="">Choose an order to review...</option>
                {orders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.id} - {order.product}
                  </option>
                ))}
              </select>
            </div>

            {/* Star Rating */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Rating <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <StarRating
                rating={formData.rating}
                onChange={(rating) => setFormData({ ...formData, rating })}
                size="lg"
              />
              {formData.rating > 0 && (
                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginTop: '0.5rem' }}>
                  {formData.rating} out of 5 stars
                </p>
              )}
            </div>

            {/* Review Title */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Review Title <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Summarize your experience (max 100 characters)"
                maxLength={100}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--color-gray-300)',
                  fontSize: '0.875rem',
                }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '0.25rem', textAlign: 'right' }}>
                {formData.title.length}/100
              </p>
            </div>

            {/* Review Text */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Detailed Review <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <textarea
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                placeholder="Share your detailed feedback about the account quality, delivery, and overall experience (max 1000 characters)"
                maxLength={1000}
                required
                rows={6}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--color-gray-300)',
                  fontSize: '0.875rem',
                  resize: 'vertical',
                }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '0.25rem', textAlign: 'right' }}>
                {formData.review.length}/1000
              </p>
            </div>

            {/* Image Upload */}
            <div>
              <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                Upload Images (Optional)
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png"
                multiple
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--color-gray-300)',
                  fontSize: '0.875rem',
                }}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', marginTop: '0.25rem' }}>
                You can upload up to 3 images (JPG, PNG, max 5MB each)
              </p>
            </div>

            {/* Recommendation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem', backgroundColor: 'var(--color-gray-50)', borderRadius: '0.5rem' }}>
              <input
                type="checkbox"
                id="recommend"
                checked={formData.recommend}
                onChange={(e) => setFormData({ ...formData, recommend: e.target.checked })}
              />
              <label htmlFor="recommend" style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                Would you recommend this to others?
              </label>
            </div>

            {/* Submit Button */}
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button type="submit" fullWidth size="lg" disabled={!formData.orderId || !formData.rating || !formData.title || !formData.review}>
                Submit Review
              </Button>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)', textAlign: 'center' }}>
              By submitting this review, you agree to our <a href="/review-guidelines" style={{ color: 'var(--color-primary)' }}>Review Guidelines</a>
            </p>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
