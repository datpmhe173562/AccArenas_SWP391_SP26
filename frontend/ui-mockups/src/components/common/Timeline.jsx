export default function Timeline({ events = [] }) {
    return (
        <div style={{ position: 'relative', paddingLeft: '2rem' }}>
            {events.map((event, index) => (
                <div key={index} style={{ position: 'relative', paddingBottom: '2rem' }}>
                    {/* Vertical line */}
                    {index < events.length - 1 && (
                        <div
                            style={{
                                position: 'absolute',
                                left: '-1.5rem',
                                top: '1.5rem',
                                bottom: '-0.5rem',
                                width: '2px',
                                backgroundColor: 'var(--color-gray-300)',
                            }}
                        />
                    )}

                    {/* Circle indicator */}
                    <div
                        style={{
                            position: 'absolute',
                            left: '-1.75rem',
                            top: '0.25rem',
                            width: '0.75rem',
                            height: '0.75rem',
                            borderRadius: '50%',
                            backgroundColor: event.completed ? 'var(--color-primary)' : 'var(--color-gray-300)',
                            border: '2px solid white',
                        }}
                    />

                    {/* Event content */}
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.25rem' }}>
                            <h4 style={{ fontWeight: '600', fontSize: '0.875rem', margin: 0 }}>{event.title}</h4>
                            {event.date && (
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>{event.date}</span>
                            )}
                        </div>
                        {event.description && (
                            <p style={{ fontSize: '0.875rem', color: 'var(--color-gray-600)', margin: 0 }}>
                                {event.description}
                            </p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}
