import { Link } from 'react-router-dom';
import { UserCircleIcon, Bars3Icon } from '@heroicons/react/24/outline';
import './Header.css';

export default function Header({ user, onMenuClick }) {
    return (
        <header className="header">
            <div className="header-container">
                <div className="header-left">
                    <button className="menu-button md:hidden" onClick={onMenuClick}>
                        <Bars3Icon className="w-6 h-6" />
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
                        <UserCircleIcon className="w-8 h-8 text-gray-600" />
                        <span className="user-name">{user.name}</span>
                    </div>
                )}
            </div>
        </header>
    );
}
