import './Badge.css';

export default function Badge({
    children,
    variant = 'primary',
    size = 'md',
    className = ''
}) {
    const classes = `badge badge-${variant} badge-${size} ${className}`;

    return (
        <span className={classes}>
            {children}
        </span>
    );
}
