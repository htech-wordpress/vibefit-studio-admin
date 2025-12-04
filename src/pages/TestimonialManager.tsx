import { useState, useEffect } from 'react';
import { Plus, Star } from 'lucide-react';
import { testimonialService } from '../services/dataService';
import { websiteConfigService } from '../services/websiteConfigService';
import styles from './TestimonialManager.module.css';
import commonStyles from '../styles/common.module.css';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    rating: number;
    content: string;
    image: string;
}

export default function TestimonialManager() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const data = await testimonialService.fetchAll();
            setTestimonials(data as Testimonial[]);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this testimonial?')) {
            try {
                await testimonialService.delete(id);
                setTestimonials(testimonials.filter(t => t.id !== id));

                // Sync to website/gymProData for user template
                await websiteConfigService.syncTestimonials();
            } catch (error) {
                console.error('Error deleting testimonial:', error);
                alert('Failed to delete testimonial');
            }
        }
    };

    if (loading) {
        return (
            <div className={commonStyles.pageContainer}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading testimonials...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={commonStyles.pageContainer}>
            <div className={commonStyles.pageHeader}>
                <div className={commonStyles.headerContent}>
                    <h1 className={commonStyles.pageTitle}>Testimonials</h1>
                    <p className={commonStyles.pageSubtitle}>
                        {testimonials.length} customer testimonials
                    </p>
                </div>
                <button className={commonStyles.primaryButton}>
                    <Plus className="w-5 h-5" />
                    <span>Add Testimonial</span>
                </button>
            </div>

            {/* Testimonials List */}
            {testimonials.length === 0 ? (
                <div className={commonStyles.card} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    No testimonials yet. Click "Add Testimonial" to create one.
                </div>
            ) : (
                <div className={styles.testimonialList}>
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className={styles.testimonialCard}>
                            <div className={styles.testimonialContent}>
                                <div className={styles.testimonialMain}>
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className={styles.avatar}
                                    />
                                    <div className={styles.testimonialInfo}>
                                        <h3 className={styles.testimonialName}>{testimonial.name}</h3>
                                        <p className={styles.testimonialRole}>{testimonial.role}</p>
                                        <div className={styles.rating}>
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className={styles.testimonialText}>"{testimonial.content}"</p>
                                    </div>
                                </div>
                                <div className={styles.testimonialActions}>
                                    <button className={`${styles.actionButton} ${styles.editButton}`}>
                                        Edit
                                    </button>
                                    <button
                                        className={`${styles.actionButton} ${styles.deleteButton}`}
                                        onClick={() => handleDelete(testimonial.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
