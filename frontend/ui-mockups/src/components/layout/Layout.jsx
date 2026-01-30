import { useState } from 'react';
import Header from './Header';
import './Layout.css';

export default function Layout({ children, user }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="layout">
            <Header user={user} onMenuClick={() => setMenuOpen(!menuOpen)} />
            <main className="layout-main">
                {children}
            </main>
            <footer className="layout-footer">
                <div className="footer-content">
                    <p>&copy; 2026 AccArenas. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
