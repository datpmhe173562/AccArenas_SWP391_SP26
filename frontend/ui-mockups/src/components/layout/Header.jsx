import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ user, onMenuClick }) {
    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    <button className="menu-button md:hidden" onClick={onMenuClick}>
                        <span className="menu-icon">Menu</span>
                    </button>
                    <Link to="/" className="header-logo">
                        <span className="logo-text">AccArenas</span>
                    </Link>
                </div>

                <nav className="header-nav">
                    <Link to="/browse" className="nav-link">Browse</Link>
                    <Link to="/promotions" className="nav-link">Promotions</Link>
                    {user ? (
                        <>
                            <Link to="/orders" className="nav-link">Orders</Link>
                            <Link to="/profile" className="nav-link">Profile</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="nav-link">Login</Link>
                            <Link to="/register" className="nav-link-primary">Register</Link>
                        </>
                    )}
                </nav>

                {user && (
                    <div className="header-user">
                        <span className="user-icon">User</span>
                        <span className="user-name">{user.name}</span>
                    </div>
                )}
            </div>
        </header>
    );
}
