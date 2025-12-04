import { useState, useEffect } from 'react';
import { Users, Mail, Dumbbell, TrendingUp } from 'lucide-react';
import { customerService, programService } from '../services/dataService';
import styles from './Dashboard.module.css';

interface DashboardStats {
    totalCustomers: number;
    newInquiries: number;
    activePrograms: number;
    recentInquiries: any[];
}

export default function Dashboard() {
    const [stats, setStats] = useState<DashboardStats>({
        totalCustomers: 0,
        newInquiries: 0,
        activePrograms: 0,
        recentInquiries: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Fetch customers and programs in parallel
            const [customers, programs] = await Promise.all([
                customerService.fetchAll(),
                programService.fetchAll()
            ]);

            // Calculate stats
            const newInquiries = customers.filter((c: any) => c.status === 'new').length;
            const recentInquiries = customers.slice(0, 5);

            setStats({
                totalCustomers: customers.length,
                newInquiries,
                activePrograms: programs.length,
                recentInquiries
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        { label: 'Total Customers', value: stats.totalCustomers.toString(), icon: Users, color: 'blue' },
        { label: 'New Inquiries', value: stats.newInquiries.toString(), icon: Mail, color: 'green' },
        { label: 'Active Programs', value: stats.activePrograms.toString(), icon: Dumbbell, color: 'purple' },
        { label: 'Growth', value: '+23%', icon: TrendingUp, color: 'orange' },
    ];

    if (loading) {
        return (
            <div className={styles.container}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Dashboard</h1>
                <p className={styles.subtitle}>Overview of your gym management</p>
            </div>

            {/* Stats Grid */}
            <div className={styles.statsGrid}>
                {statCards.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label} className={styles.statCard}>
                            <div className={styles.statContent}>
                                <div className={styles.statInfo}>
                                    <p className={styles.statLabel}>{stat.label}</p>
                                    <p className={styles.statValue}>{stat.value}</p>
                                </div>
                                <div className={`${styles.statIcon} ${styles[stat.color]}`}>
                                    <Icon className="w-6 h-6 text-white" />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className={styles.activityCard}>
                <div className={styles.activityHeader}>
                    <h2 className={styles.activityTitle}>Recent Inquiries</h2>
                </div>
                <div className={styles.activityContent}>
                    {stats.recentInquiries.length === 0 ? (
                        <p style={{ color: '#6b7280', textAlign: 'center' }}>No inquiries yet</p>
                    ) : (
                        <div className={styles.activityList}>
                            {stats.recentInquiries.map((inquiry: any) => (
                                <div key={inquiry.id} className={styles.activityItem}>
                                    <div className={styles.activityInfo}>
                                        <p className={styles.activityName}>{inquiry.name}</p>
                                        <p className={styles.activityDescription}>
                                            {inquiry.formType === 'membership' ? 'Interested in Membership' :
                                                inquiry.formType === 'program' ? `Interested in ${inquiry.programName || 'Program'}` :
                                                    inquiry.formType === 'personal-training' ? 'Interested in Personal Training' :
                                                        'General Inquiry'}
                                        </p>
                                    </div>
                                    <span className={styles.badge}>
                                        {inquiry.status === 'new' ? 'New' :
                                            inquiry.status === 'contacted' ? 'Contacted' :
                                                'Converted'}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
