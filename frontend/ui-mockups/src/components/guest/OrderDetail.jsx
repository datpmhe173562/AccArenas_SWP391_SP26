import { useParams } from 'react-router-dom';
import Card, { CardBody, CardHeader } from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';

export default function OrderDetail() {
    const { id } = useParams();

    const order = {
        id: id || 'ORD-001',
        date: '2026-01-25 14:30:00',
        product: 'League of Legends Diamond II Account',
        amount: '$150',
        status: 'completed',
        paymentMethod: 'Credit Card',
        credentials: {
            username: 'lol_diamond_2026',
            password: '********',
            server: 'North America'
        },
        timeline: [
            { status: 'Order Placed', date: '2026-01-25 14:30', completed: true },
            { status: 'Payment Confirmed', date: '2026-01-25 14:31', completed: true },
            { status: 'Processing', date: '2026-01-25 14:35', completed: true },
            { status: 'Credentials Sent', date: '2026-01-25 15:00', completed: true },
            { status: 'Completed', date: '2026-01-25 15:05', completed: true },
        ]
    };

    return (
        <div className="container" style={{ maxWidth: '900px', paddingTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Order Details</h1>
                    <p style={{ color: 'var(--color-gray-600)' }}>
                        This screen allows the Customer to view detailed information of a selected order
                    </p>
                </div>
                <Badge variant="success" size="lg">{order.status}</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <Card>
                    <CardHeader>Order Information</CardHeader>
                    <CardBody>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Order ID</p>
                                <p style={{ fontWeight: '600' }}>{order.id}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Order Date</p>
                                <p style={{ fontWeight: '600' }}>{order.date}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Product</p>
                                <p style={{ fontWeight: '600' }}>{order.product}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Amount</p>
                                <p style={{ fontWeight: '600', fontSize: '1.25rem', color: 'var(--color-primary)' }}>{order.amount}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Payment Method</p>
                                <p style={{ fontWeight: '600' }}>{order.paymentMethod}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>Account Credentials</CardHeader>
                    <CardBody>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Username</p>
                                <p style={{ fontWeight: '600', fontFamily: 'monospace' }}>{order.credentials.username}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Password</p>
                                <p style={{ fontWeight: '600', fontFamily: 'monospace' }}>{order.credentials.password}</p>
                            </div>
                            <div>
                                <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>Server</p>
                                <p style={{ fontWeight: '600' }}>{order.credentials.server}</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader>Order Timeline</CardHeader>
                    <CardBody>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {order.timeline.map((item, index) => (
                                <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: item.completed ? 'var(--color-success)' : 'var(--color-gray-300)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '0.75rem'
                                    }}>
                                        {item.completed && '✓'}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: '600' }}>{item.status}</p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)' }}>{item.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </Card>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button onClick={() => window.location.href = '/feedback'}>Submit Feedback</Button>
                    <Button variant="outline" onClick={() => window.location.href = '/orders'}>Back to Orders</Button>
                </div>
            </div>
        </div>
    );
}
