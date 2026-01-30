export default function MetricCard({ title, value, icon, trend, color = 'primary' }) {
    const colors = {
        primary: 'var(--color-primary)',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
    };

    return (
        <div
            style={{
                backgroundColor: 'white',
                borderRadius: '0.5rem',
                padding: '1.5rem',
                boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', margin: '0 0 0.5rem 0' }}>
                        {title}
                    </p>
                    <p style={{ fontSize: '1.875rem', fontWeight: 'bold', color: colors[color], margin: 0 }}>
                        {value}
                    </p>
                    {trend && (
                        <p style={{ fontSize: '0.75rem', color: trend.positive ? '#10b981' : '#ef4444', marginTop: '0.5rem' }}>
                            {trend.positive ? '↑' : '↓'} {trend.value}
                        </p>
                    )}
                </div>
                {icon && (
                    <div
                        style={{
                            width: '3rem',
                            height: '3rem',
                            borderRadius: '0.5rem',
                            backgroundColor: `${colors[color]}20`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: colors[color],
                        }}
                    >
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
