import './Input.css';

export default function Input({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    error,
    disabled = false,
    required = false,
    icon,
    className = '',
    ...props
}) {
    return (
        <div className={`input-group ${className}`}>
            {label && (
                <label className="input-label">
                    {label}
                    {required && <span className="text-danger"> *</span>}
                </label>
            )}
            <div className="input-wrapper">
                {icon && <span className="input-icon">{icon}</span>}
                <input
                    type={type}
                    className={`input ${icon ? 'input-with-icon' : ''} ${error ? 'input-error' : ''}`}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    required={required}
                    {...props}
                />
            </div>
            {error && <span className="input-error-message">{error}</span>}
        </div>
    );
}
