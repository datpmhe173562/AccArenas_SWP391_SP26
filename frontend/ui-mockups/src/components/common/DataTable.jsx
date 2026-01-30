export default function DataTable({ columns = [], data = [], onRowClick }) {
    return (
        <div style={{ overflowX: 'auto', backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-gray-200)', backgroundColor: 'var(--color-gray-50)' }}>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                style={{
                                    padding: '0.75rem 1rem',
                                    textAlign: 'left',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: 'var(--color-gray-700)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                style={{
                                    padding: '2rem',
                                    textAlign: 'center',
                                    color: 'var(--color-gray-500)',
                                    fontSize: '0.875rem',
                                }}
                            >
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                onClick={() => onRowClick && onRowClick(row)}
                                style={{
                                    borderBottom: '1px solid var(--color-gray-200)',
                                    cursor: onRowClick ? 'pointer' : 'default',
                                    transition: 'background-color 0.15s',
                                }}
                                onMouseEnter={(e) => {
                                    if (onRowClick) e.currentTarget.style.backgroundColor = 'var(--color-gray-50)';
                                }}
                                onMouseLeave={(e) => {
                                    if (onRowClick) e.currentTarget.style.backgroundColor = 'transparent';
                                }}
                            >
                                {columns.map((column, colIndex) => (
                                    <td
                                        key={colIndex}
                                        style={{
                                            padding: '1rem',
                                            fontSize: '0.875rem',
                                            color: 'var(--color-gray-900)',
                                        }}
                                    >
                                        {column.render ? column.render(row[column.key], row) : row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
