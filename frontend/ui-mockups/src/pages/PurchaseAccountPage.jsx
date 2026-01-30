import { useState } from 'react';
import Card, { CardBody } from '../components/common/Card';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function PurchaseAccountPage() {
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit-card');
  const [agreeTerms, setAgreeTerms] = useState(false);

  const selectedAccount = {
    name: 'League of Legends Diamond II Account',
    rank: 'Diamond II',
    level: 150,
    server: 'NA',
    price: 150,
    features: ['100+ Skins', 'All Champions', 'High Honor Level']
  };

  const applyVoucher = () => {
    if (voucherCode === 'SAVE10') {
      setAppliedVoucher({ code: voucherCode, discount: 15 });
    } else {
      alert('Invalid voucher code');
    }
  };

  const subtotal = selectedAccount.price;
  const discount = appliedVoucher ? appliedVoucher.discount : 0;
  const total = subtotal - discount;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Checkout</h1>
      <p style={{ color: 'var(--color-gray-600)', marginBottom: '2rem' }}>
        Review your order and complete the purchase
      </p>

      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Selected Account Summary */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Selected Account</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '1rem' }}>
              <div style={{ height: '120px', backgroundColor: 'var(--color-gray-200)', borderRadius: '0.5rem' }}></div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '0.5rem' }}>{selectedAccount.name}</h4>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <Badge variant="primary">{selectedAccount.rank}</Badge>
                  <Badge variant="gray">{selectedAccount.server}</Badge>
                  <Badge variant="gray">Level {selectedAccount.level}</Badge>
                </div>
                <ul style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', marginLeft: '1.25rem' }}>
                  {selectedAccount.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Voucher Code */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Promotional Code</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={voucherCode}
                onChange={(e) => setVoucherCode(e.target.value)}
                placeholder="Enter voucher code"
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  borderRadius: '0.375rem',
                  border: '1px solid var(--color-gray-300)',
                }}
              />
              <Button onClick={applyVoucher}>Apply</Button>
            </div>
            {appliedVoucher && (
              <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#d1fae5', borderRadius: '0.375rem', fontSize: '0.875rem', color: '#10b981' }}>
                ✓ Voucher "{appliedVoucher.code}" applied! You saved ${appliedVoucher.discount}
                <button
                  onClick={() => { setAppliedVoucher(null); setVoucherCode(''); }}
                  style={{ marginLeft: '0.5rem', background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Remove
                </button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Payment Method */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { value: 'credit-card', label: 'Credit Card', fee: 0 },
                { value: 'e-wallet', label: 'E-Wallet (PayPal, Stripe)', fee: 0 },
                { value: 'bank-transfer', label: 'Bank Transfer', fee: 0 },
              ].map((method) => (
                <label
                  key={method.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '1rem',
                    border: `2px solid ${paymentMethod === method.value ? 'var(--color-primary)' : 'var(--color-gray-300)'}`,
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.value}
                    checked={paymentMethod === method.value}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    style={{ marginRight: '0.75rem' }}
                  />
                  <span style={{ flex: 1, fontWeight: '500' }}>{method.label}</span>
                  {method.fee > 0 && <span style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>+${method.fee} fee</span>}
                </label>
              ))}
            </div>
          </CardBody>
        </Card>

        {/* Order Summary */}
        <Card>
          <CardBody>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>Order Summary</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--color-gray-600)' }}>Subtotal:</span>
                <span>${subtotal}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10b981' }}>
                  <span>Discount:</span>
                  <span>-${discount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '2px solid var(--color-gray-200)', fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
                <span>Total:</span>
                <span style={{ color: 'var(--color-primary)' }}>${total}</span>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Terms and Conditions */}
        <div style={{ display: 'flex', alignItems: 'start', gap: '0.5rem' }}>
          <input
            type="checkbox"
            id="terms"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={{ marginTop: '0.25rem' }}
          />
          <label htmlFor="terms" style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>
            I agree to the <a href="/terms" style={{ color: 'var(--color-primary)' }}>Terms and Conditions</a> and understand that all sales are final
          </label>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Button fullWidth size="lg" disabled={!agreeTerms}>
            Complete Purchase - ${total}
          </Button>
        </div>
      </div>
    </div>
  );
}
