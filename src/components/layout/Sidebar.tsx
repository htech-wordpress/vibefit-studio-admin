import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Dumbbell,
    MessageCircle,
    Mail,
    Image,
    Star,
    Share2,
    Menu,
    X
} from 'lucide-react';
import styles from './Sidebar.module.css';

const menuItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/customers', icon: Users, label: 'Customer List' },
    { path: '/services', icon: Dumbbell, label: 'Services/Programs' },
    { path: '/whatsapp', icon: MessageCircle, label: 'WhatsApp' },
    { path: '/contact', icon: Mail, label: 'Contact Us' },
    { path: '/gallery', icon: Image, label: 'Gallery' },
    { path: '/testimonials', icon: Star, label: 'Testimonials' },
    { path: '/social', icon: Share2, label: 'Social Media' },
];

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={styles.mobileButton}
            >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Sidebar */}
            <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
                {/* Logo/Header */}
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <Dumbbell className={styles.logoIcon} />
                        <h1 className={styles.logoText}>Gym Admin</h1>
                    </div>
                </div>

                {/* Navigation */}
                <nav className={styles.nav}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsOpen(false)}
                                className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                            >
                                <Icon className={styles.navIcon} />
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className={styles.footer}>
                    <p className={styles.footerText}>© 2025 Gym Admin Panel</p>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className={styles.overlay}
                />
            )}
        </>
    );
}
