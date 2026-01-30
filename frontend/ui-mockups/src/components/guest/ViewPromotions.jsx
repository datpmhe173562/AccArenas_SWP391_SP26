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
