import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { customerService } from '../services/dataService';
import styles from './CustomerList.module.css';
import commonStyles from '../styles/common.module.css';

interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    message?: string;
    formType: string;
    status: string;
    createdAt?: any;
}

export default function CustomerList() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const data = await customerService.fetchAll();
            setCustomers(data as Customer[]);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await customerService.delete(id);
                setCustomers(customers.filter(c => c.id !== id));
            } catch (error) {
                console.error('Error deleting customer:', error);
                alert('Failed to delete customer');
            }
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await customerService.update(id, { status: newStatus });
            setCustomers(customers.map(c =>
                c.id === id ? { ...c, status: newStatus } : c
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Failed to update status');
        }
    };

    const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm)
    );

    if (loading) {
        return (
            <div className={commonStyles.pageContainer}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading customers...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={commonStyles.pageContainer}>
            <div className={commonStyles.pageHeader}>
                <div className={commonStyles.headerContent}>
                    <h1 className={commonStyles.pageTitle}>Customer List</h1>
                    <p className={commonStyles.pageSubtitle}>
                        {customers.length} total inquiries
                    </p>
                </div>
                <button className={commonStyles.primaryButton}>
                    Export Data
                </button>
            </div>

            {/* Search and Filter */}
            <div className={styles.searchBar}>
                <div className={styles.searchContainer}>
                    <div className={styles.searchInput}>
                        <Search className={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className={styles.filterButton}>
                        <Filter className="w-5 h-5" />
                        <span>Filter</span>
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className={commonStyles.card}>
                {filteredCustomers.length === 0 ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                        {searchTerm ? 'No customers found matching your search' : 'No customer inquiries yet'}
                    </div>
                ) : (
                    <table className={styles.table}>
                        <thead className={styles.tableHead}>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Phone</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className={styles.tableBody}>
                            {filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>
                                        <div className={styles.tableName}>{customer.name}</div>
                                    </td>
                                    <td className={styles.tableText}>{customer.email}</td>
                                    <td className={styles.tableText}>{customer.phone}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles.badgeBlue}`}>
                                            {customer.formType || 'General'}
                                        </span>
                                    </td>
                                    <td>
                                        <select
                                            value={customer.status || 'new'}
                                            onChange={(e) => handleStatusUpdate(customer.id, e.target.value)}
                                            className={`${styles.badge} ${customer.status === 'new' ? styles.badgeGreen :
                                                    customer.status === 'contacted' ? styles.badgeYellow :
                                                        styles.badgePurple
                                                }`}
                                            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
                                        >
                                            <option value="new">New</option>
                                            <option value="contacted">Contacted</option>
                                            <option value="converted">Converted</option>
                                            <option value="closed">Closed</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button className={styles.actionButton}>View</button>
                                        <button
                                            className={`${styles.actionButton} ${styles.deleteButton}`}
                                            onClick={() => handleDelete(customer.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
