import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { settingsService } from '../services/dataService';
import { websiteConfigService } from '../services/websiteConfigService';
import commonStyles from '../styles/common.module.css';
import formStyles from '../styles/form.module.css';

interface WhatsAppSettings {
    phoneNumber: string;
    defaultMessage: string;
    enabled: boolean;
}

export default function WhatsAppSettings() {
    const [settings, setSettings] = useState<WhatsAppSettings>({
        phoneNumber: '',
        defaultMessage: '',
        enabled: false
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const data = await settingsService.fetchWhatsApp();
            if (data) {
                const whatsappData = data as any;
                setSettings({
                    phoneNumber: whatsappData.phoneNumber || '',
                    defaultMessage: whatsappData.defaultMessage || whatsappData.message || '',
                    enabled: whatsappData.enabled ?? false
                });
            }
        } catch (error) {
            console.error('Error fetching WhatsApp settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSaving(true);
            await settingsService.updateWhatsApp(settings);

            // Sync to website/gymProData for user template
            await websiteConfigService.syncWhatsApp();

            alert('Settings saved successfully!');
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
                <h1 className={commonStyles.pageTitle}>WhatsApp Settings</h1>
                <p className={commonStyles.pageSubtitle}>Configure WhatsApp integration</p>
            </div>

            <div className={formStyles.formCard}>
                <form className={formStyles.form} onSubmit={handleSubmit}>
                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>
                            WhatsApp Number
                        </label>
                        <input
                            type="tel"
                            placeholder="+1234567890"
                            className={formStyles.input}
                            value={settings.phoneNumber}
                            onChange={(e) => setSettings({ ...settings, phoneNumber: e.target.value })}
                        />
                        <p className={formStyles.helpText}>Include country code (e.g., +1 for USA)</p>
                    </div>

                    <div className={formStyles.formGroup}>
                        <label className={formStyles.label}>
                            Default Message
                        </label>
                        <textarea
                            rows={4}
                            placeholder="Hi! I'm interested in joining your gym..."
                            className={formStyles.textarea}
                            value={settings.defaultMessage}
                            onChange={(e) => setSettings({ ...settings, defaultMessage: e.target.value })}
                        />
                        <p className={formStyles.helpText}>This message will be pre-filled when users click WhatsApp button</p>
                    </div>

                    <div className={formStyles.checkbox}>
                        <input
                            type="checkbox"
                            id="enableWhatsApp"
                            checked={settings.enabled}
                            onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
                        />
                        <label htmlFor="enableWhatsApp">
                            Enable WhatsApp floating button on website
                        </label>
                    </div>

                    <button
                        type="submit"
                        className={formStyles.submitButton}
                        disabled={saving}
                    >
                        <Save className="w-5 h-5" />
                        <span>{saving ? 'Saving...' : 'Save Settings'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
