import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './AdminLayout.module.css';

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className={styles.content}>
                {/* Header */}
                <Header />

                {/* Page Content */}
                <main className={styles.main}>
                    {children}
                </main>
            </div>
        </div>
    );
}
