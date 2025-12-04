import { useState, useEffect } from 'react';
import { Facebook, Instagram, Twitter, Youtube, Save } from 'lucide-react';
import { settingsService } from '../services/dataService';
import { websiteConfigService } from '../services/websiteConfigService';
import commonStyles from '../styles/common.module.css';
import formStyles from '../styles/form.module.css';

interface SocialMediaSettings {
    id?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
}

export default function SocialMedia() {
    const [settings, setSettings] = useState<SocialMediaSettings>({
        facebook: '',
        instagram: '',
        twitter: '',
        youtube: ''
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await settingsService.fetchSocial();
            if (data && typeof data === 'object') {
                const socialData = data as any;
                setSettings({
                    id: socialData.id,
                    facebook: socialData.facebook ?? '',
                    instagram: socialData.instagram ?? '',
                    twitter: socialData.twitter ?? '',
                    youtube: socialData.youtube ?? ''
                });
            }
        } catch (error) {
            console.error('Error fetching social media settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            // Exclude id from the update payload
            const { id, ...settingsToSave } = settings;
            await settingsService.updateSocial(settingsToSave);

            // Sync to website/gymProData for user template
            await websiteConfigService.syncSocialMedia();

            alert('Social media links saved successfully!');
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={commonStyles.pageContainer}>
                <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p>Loading settings...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={commonStyles.pageContainer}>
            <div className={commonStyles.headerContent}>
                <h1 className={commonStyles.pageTitle}>Social Media</h1>
                <p className={commonStyles.pageSubtitle}>Manage your social media links</p>
            </div>

            <div className={formStyles.formCard}>
                <form className={formStyles.form} onSubmit={handleSubmit}>
                    {/* Facebook */}
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Facebook className="w-5 h-5 text-blue-600" />
                            <span>Facebook</span>
                        </label>
                        <input
                            type="url"
                            placeholder="https://facebook.com/yourgym"
                            className={formStyles.input}
                            value={settings.facebook ?? ''}
                            onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                        />
                    </div>

                    {/* Instagram */}
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Instagram className="w-5 h-5 text-pink-600" />
                            <span>Instagram</span>
                        </label>
                        <input
                            type="url"
                            placeholder="https://instagram.com/yourgym"
                            className={formStyles.input}
                            value={settings.instagram ?? ''}
                            onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                        />
                    </div>

                    {/* Twitter */}
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Twitter className="w-5 h-5 text-blue-400" />
                            <span>Twitter / X</span>
                        </label>
                        <input
                            type="url"
                            placeholder="https://twitter.com/yourgym"
                            className={formStyles.input}
                            value={settings.twitter ?? ''}
                            onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                        />
                    </div>

                    {/* YouTube */}
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Youtube className="w-5 h-5 text-red-600" />
                            <span>YouTube</span>
                        </label>
                        <input
                            type="url"
                            placeholder="https://youtube.com/@yourgym"
                            className={formStyles.input}
                            value={settings.youtube ?? ''}
                            onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                        />
                    </div>

                    <button
                        type="submit"
                        className={formStyles.submitButton}
                        disabled={saving}
                    >
                        <Save className="w-5 h-5" />
                        <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
