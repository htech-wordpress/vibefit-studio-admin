import { Eye } from 'lucide-react';
import styles from './CustomerList.module.css';
import commonStyles from '../styles/common.module.css';

export default function ContactSubmissions() {
    const submissions = [
        { id: 1, name: 'Alice Johnson', email: 'alice@example.com', message: 'I want to know about membership plans', date: '2025-12-03', status: 'Unread' },
        { id: 2, name: 'Bob Smith', email: 'bob@example.com', message: 'What are your gym timings?', date: '2025-12-02', status: 'Read' },
        { id: 3, name: 'Carol White', email: 'carol@example.com', message: 'Do you offer personal training?', date: '2025-12-01', status: 'Responded' },
    ];

    return (
        <div className={commonStyles.pageContainer}>
            <div className={commonStyles.headerContent}>
                <h1 className={commonStyles.pageTitle}>Contact Submissions</h1>
                <p className={commonStyles.pageSubtitle}>View and manage contact form submissions</p>
            </div>

            <div className={commonStyles.card}>
                <table className={styles.table}>
                    <thead className={styles.tableHead}>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Message</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className={styles.tableBody}>
                        {submissions.map((submission) => (
                            <tr key={submission.id}>
                                <td className={styles.tableName}>{submission.name}</td>
                                <td className={styles.tableText}>{submission.email}</td>
                                <td className={styles.tableText} style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {submission.message}
                                </td>
                                <td className={styles.tableText}>{submission.date}</td>
                                <td>
                                    <span className={`${styles.badge} ${submission.status === 'Unread' ? styles.badgeGreen :
                                            submission.status === 'Read' ? styles.badgeYellow :
                                                styles.badgePurple
                                        }`}>
                                        {submission.status}
                                    </span>
                                </td>
                                <td>
                                    <button className={styles.actionButton}>
                                        <Eye className="w-4 h-4" style={{ display: 'inline', marginRight: '4px' }} />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
