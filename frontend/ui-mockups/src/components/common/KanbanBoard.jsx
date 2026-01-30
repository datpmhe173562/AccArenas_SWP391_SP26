import { useState } from 'react';

export default function KanbanBoard({ columns = [], onCardMove }) {
    const [draggedCard, setDraggedCard] = useState(null);

    const handleDragStart = (card, columnId) => {
        setDraggedCard({ card, fromColumn: columnId });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (toColumnId) => {
        if (draggedCard && onCardMove) {
            onCardMove(draggedCard.card, draggedCard.fromColumn, toColumnId);
        }
        setDraggedCard(null);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns.length}, 1fr)`, gap: '1rem', overflowX: 'auto' }}>
            {columns.map((column) => (
                <div
                    key={column.id}
                    onDragOver={handleDragOver}
                    onDrop={() => handleDrop(column.id)}
                    style={{
                        backgroundColor: 'var(--color-gray-50)',
                        borderRadius: '0.5rem',
                        padding: '1rem',
                        minWidth: '250px',
                    }}
                >
                    <div style={{ marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-gray-700)', margin: 0 }}>
                            {column.title}
                        </h3>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-gray-500)' }}>
                            {column.cards.length} items
                        </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {column.cards.map((card) => (
                            <div
                                key={card.id}
                                draggable
                                onDragStart={() => handleDragStart(card, column.id)}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '0.375rem',
                                    padding: '1rem',
                                    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                                    cursor: 'move',
                                    transition: 'box-shadow 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
                                }}
                            >
                                <h4 style={{ fontSize: '0.875rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>
                                    {card.title}
                                </h4>
                                {card.description && (
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-gray-600)', margin: '0 0 0.5rem 0' }}>
                                        {card.description}
                                    </p>
                                )}
                                {card.metadata && (
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        {Object.entries(card.metadata).map(([key, value]) => (
                                            <span
                                                key={key}
                                                style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.125rem 0.5rem',
                                                    backgroundColor: 'var(--color-gray-100)',
                                                    borderRadius: '0.25rem',
                                                    color: 'var(--color-gray-700)',
                                                }}
                                            >
                                                {value}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
