import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { programService } from '../services/dataService';
import { websiteConfigService } from '../services/websiteConfigService';
import styles from './ServicesPrograms.module.css';
import commonStyles from '../styles/common.module.css';

interface Program {
    id: string;
    name: string;
    price: string;
    duration: string;
    description?: string;
    features?: string[];
}

export default function ServicesPrograms() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPrograms();
    }, []);

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const data = await programService.fetchAll();
            setPrograms(data as Program[]);
        } catch (error) {
            console.error('Error fetching programs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this program?')) {
            try {
                await programService.delete(id);
                setPrograms(programs.filter(p => p.id !== id));

                // Sync to website/gymProData for user template
                await websiteConfigService.syncPrograms();
            } catch (error) {
                console.error('Error deleting program:', error);
                alert('Failed to delete program');
            }
        }
    };

    if (loading) {
        return (
            <div className={commonStyles.pageContainer}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading programs...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={commonStyles.pageContainer}>
            <div className={commonStyles.pageHeader}>
                <div className={commonStyles.headerContent}>
                    <h1 className={commonStyles.pageTitle}>Services & Programs</h1>
                    <p className={commonStyles.pageSubtitle}>
                        {programs.length} active programs
                    </p>
                </div>
                <button className={commonStyles.primaryButton}>
                    <Plus className="w-5 h-5" />
                    <span>Add Program</span>
                </button>
            </div>

            {/* Programs Grid */}
            {programs.length === 0 ? (
                <div className={commonStyles.card} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    No programs yet. Click "Add Program" to create one.
                </div>
            ) : (
                <div className={styles.programsGrid}>
                    {programs.map((program) => (
                        <div key={program.id} className={styles.programCard}>
                            <h3 className={styles.programTitle}>{program.name}</h3>
                            <div className={styles.programDetails}>
                                <p className={styles.programPrice}>{program.price}</p>
                                <p className={styles.programInfo}>Duration: {program.duration}</p>
                                {program.description && (
                                    <p className={styles.programInfo} style={{ marginTop: '0.5rem' }}>
                                        {program.description}
                                    </p>
                                )}
                            </div>
                            <div className={styles.programActions}>
                                <button className={styles.editButton}>Edit</button>
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDelete(program.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
