import { useState, useEffect } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { galleryService } from '../services/dataService';
import { websiteConfigService } from '../services/websiteConfigService';
import styles from './GalleryManager.module.css';
import commonStyles from '../styles/common.module.css';

interface GalleryImage {
    id: string;
    url: string;
    caption: string;
    category?: string;
}

export default function GalleryManager() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            const data = await galleryService.fetchAll();
            setImages(data as GalleryImage[]);
        } catch (error) {
            console.error('Error fetching gallery images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this image?')) {
            try {
                await galleryService.delete(id);
                setImages(images.filter(img => img.id !== id));

                // Sync to website/gymProData for user template
                await websiteConfigService.syncGallery();
            } catch (error) {
                console.error('Error deleting image:', error);
                alert('Failed to delete image');
            }
        }
    };

    const handleCaptionUpdate = async (id: string, newCaption: string) => {
        try {
            await galleryService.update(id, { caption: newCaption });
            setImages(images.map(img =>
                img.id === id ? { ...img, caption: newCaption } : img
            ));

            // Sync to website/gymProData for user template
            await websiteConfigService.syncGallery();
        } catch (error) {
            console.error('Error updating caption:', error);
        }
    };

    if (loading) {
        return (
            <div className={commonStyles.pageContainer}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading gallery...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={commonStyles.pageContainer}>
            <div className={commonStyles.pageHeader}>
                <div className={commonStyles.headerContent}>
                    <h1 className={commonStyles.pageTitle}>Gallery Manager</h1>
                    <p className={commonStyles.pageSubtitle}>
                        {images.length} images in gallery
                    </p>
                </div>
                <button className={commonStyles.primaryButton}>
                    <Upload className="w-5 h-5" />
                    <span>Upload Images</span>
                </button>
            </div>

            {/* Image Grid */}
            {images.length === 0 ? (
                <div className={commonStyles.card} style={{ padding: '2rem', textAlign: 'center', color: '#6b7280' }}>
                    No images yet. Click "Upload Images" to add some.
                </div>
            ) : (
                <div className={styles.imageGrid}>
                    {images.map((image) => (
                        <div key={image.id} className={styles.imageCard}>
                            <div className={styles.imageContainer}>
                                <img
                                    src={image.url}
                                    alt={image.caption}
                                    className={styles.image}
                                />
                                <div className={styles.imageOverlay}>
                                    <button
                                        className={styles.deleteIconButton}
                                        onClick={() => handleDelete(image.id)}
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                            <div className={styles.captionInput}>
                                <input
                                    type="text"
                                    value={image.caption}
                                    onChange={(e) => handleCaptionUpdate(image.id, e.target.value)}
                                    placeholder="Image caption"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
