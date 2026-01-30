import './Table.css';

export default function Table({ columns, data, onRowClick }) {
    return (
        <div className="table-container">
            <table className="table">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th key={index} className="table-header">
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIndex) => (
                        <tr
                            key={rowIndex}
                            className={`table-row ${onRowClick ? 'table-row-clickable' : ''}`}
                            onClick={() => onRowClick && onRowClick(row)}
                        >
                            {columns.map((column, colIndex) => (
                                <td key={colIndex} className="table-cell">
                                    {column.render ? column.render(row) : row[column.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
