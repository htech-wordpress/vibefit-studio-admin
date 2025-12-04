import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User, LogOut } from 'lucide-react';
import { authService } from '../../services/authService';
import styles from './Header.module.css';

export default function Header() {
    const [userEmail, setUserEmail] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const user = authService.getCurrentUser();
        if (user) {
            setUserEmail(user.email || 'Admin User');
        }
    }, []);

    const handleLogout = async () => {
        if (window.confirm('Are you sure you want to logout?')) {
            try {
                await authService.logout();
                navigate('/login');
            } catch (error) {
                console.error('Logout error:', error);
            }
        }
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Page Title / Breadcrumb */}
                <div className={styles.titleSection}>
                    <h2 className={styles.title}>Dashboard</h2>
                    <p className={styles.subtitle}>Welcome back, Admin!</p>
                </div>

                {/* Right Side - Notifications & Profile */}
                <div className={styles.actions}>
                    {/* Notifications */}
                    <button className={styles.notificationButton}>
                        <Bell className="w-5 h-5" />
                        <span className={styles.badge}></span>
                    </button>

                    {/* Profile */}
                    <div className={styles.profile}>
                        <div className={styles.profileInfo}>
                            <p className={styles.profileName}>Admin User</p>
                            <p className={styles.profileEmail}>{userEmail}</p>
                        </div>
                        <div className={styles.avatar}>
                            <User className="w-5 h-5" />
                        </div>
                    </div>

                    {/* Logout Button */}
                    <button
                        className={styles.notificationButton}
                        onClick={handleLogout}
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </header>
    );
}
