import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import { programService, galleryService, testimonialService, settingsService } from './dataService';

// Get project ID from environment variable
const getProjectId = () => {
    const projectId = import.meta.env.VITE_PROJECT_ID;
    if (!projectId) {
        throw new Error('VITE_PROJECT_ID is not defined in environment variables');
    }
    return projectId;
};

/**
 * Service to manage the consolidated website configuration
 * Aggregates data from all collections and saves to website/gymProData
 */
export class WebsiteConfigService {
    private projectId: string;

    constructor() {
        this.projectId = getProjectId();
    }

    /**
     * Get reference to the gymProData document
     */
    private getGymProDataRef() {
        return doc(db, 'projects', this.projectId, 'website', 'gymProData');
    }

    /**
     * Fetch current gymProData
     */
    async fetchGymProData() {
        try {
            const docRef = this.getGymProDataRef();
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return docSnap.data();
            }
            return null;
        } catch (error) {
            console.error('Error fetching gymProData:', error);
            throw error;
        }
    }

    /**
     * Aggregate all data from collections and save to website/gymProData
     */
    async syncAllData() {
        try {
            console.log('🔄 Starting full data sync to website/gymProData...');

            // Fetch all data from collections
            const [programs, gallery, testimonials, whatsappSettings, socialSettings] = await Promise.all([
                programService.fetchAll(),
                galleryService.fetchAll(),
                testimonialService.fetchAll(),
                settingsService.fetchWhatsApp(),
                settingsService.fetchSocial()
            ]);

            // Get current gymProData to preserve any existing fields
            const currentData = await this.fetchGymProData() || {};

            // Build the consolidated data structure
            const gymProData = {
                ...currentData,
                programs: programs.map((program: any) => ({
                    id: program.id,
                    title: program.title || program.name || '',
                    description: program.description || '',
                    icon: program.icon || '',
                    image: program.image || program.imageUrl || ''
                })),
                gallery: gallery.map((item: any) => ({
                    id: item.id,
                    url: item.url || item.imageUrl || '',
                    alt: item.alt || item.title || '',
                    category: item.category || 'general'
                })),
                testimonials: testimonials.map((testimonial: any) => ({
                    id: testimonial.id,
                    name: testimonial.name || '',
                    role: testimonial.role || testimonial.position || '',
                    content: testimonial.content || testimonial.message || '',
                    image: testimonial.image || testimonial.imageUrl || '',
                    rating: testimonial.rating || 5
                })),
                contact: {
                    ...currentData.contact,
                    whatsappNumber: (whatsappSettings as any)?.phoneNumber || (whatsappSettings as any)?.number || '',
                    whatsappMessage: (whatsappSettings as any)?.message || 'Hello! I would like to know more about your gym.'
                },
                footer: {
                    ...currentData.footer,
                    socialMedia: {
                        facebook: (socialSettings as any)?.facebook || '',
                        instagram: (socialSettings as any)?.instagram || '',
                        twitter: (socialSettings as any)?.twitter || '',
                        youtube: (socialSettings as any)?.youtube || ''
                    }
                },
                updatedAt: new Date().toISOString()
            };

            // Save to Firestore
            const docRef = this.getGymProDataRef();
            await setDoc(docRef, gymProData, { merge: true });

            console.log('✅ Successfully synced all data to website/gymProData');
            return gymProData;
        } catch (error) {
            console.error('❌ Error syncing data to website/gymProData:', error);
            throw error;
        }
    }

    /**
     * Sync only programs data
     */
    async syncPrograms() {
        try {
            const programs = await programService.fetchAll();
            const docRef = this.getGymProDataRef();

            await setDoc(docRef, {
                programs: programs.map((program: any) => ({
                    id: program.id,
                    title: program.title || program.name || '',
                    description: program.description || '',
                    icon: program.icon || '',
                    image: program.image || program.imageUrl || ''
                })),
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log('✅ Synced programs to website/gymProData');
        } catch (error) {
            console.error('❌ Error syncing programs:', error);
            throw error;
        }
    }

    /**
     * Sync only gallery data
     */
    async syncGallery() {
        try {
            const gallery = await galleryService.fetchAll();
            const docRef = this.getGymProDataRef();

            await setDoc(docRef, {
                gallery: gallery.map((item: any) => ({
                    id: item.id,
                    url: item.url || item.imageUrl || '',
                    alt: item.alt || item.title || '',
                    category: item.category || 'general'
                })),
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log('✅ Synced gallery to website/gymProData');
        } catch (error) {
            console.error('❌ Error syncing gallery:', error);
            throw error;
        }
    }

    /**
     * Sync only testimonials data
     */
    async syncTestimonials() {
        try {
            const testimonials = await testimonialService.fetchAll();
            const docRef = this.getGymProDataRef();

            await setDoc(docRef, {
                testimonials: testimonials.map((testimonial: any) => ({
                    id: testimonial.id,
                    name: testimonial.name || '',
                    role: testimonial.role || testimonial.position || '',
                    content: testimonial.content || testimonial.message || '',
                    image: testimonial.image || testimonial.imageUrl || '',
                    rating: testimonial.rating || 5
                })),
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log('✅ Synced testimonials to website/gymProData');
        } catch (error) {
            console.error('❌ Error syncing testimonials:', error);
            throw error;
        }
    }

    /**
     * Sync WhatsApp settings
     */
    async syncWhatsApp() {
        try {
            const whatsappSettings = await settingsService.fetchWhatsApp();
            const docRef = this.getGymProDataRef();

            await setDoc(docRef, {
                contact: {
                    whatsappNumber: (whatsappSettings as any)?.phoneNumber || (whatsappSettings as any)?.number || '',
                    whatsappMessage: (whatsappSettings as any)?.message || 'Hello! I would like to know more about your gym.'
                },
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log('✅ Synced WhatsApp settings to website/gymProData');
        } catch (error) {
            console.error('❌ Error syncing WhatsApp settings:', error);
            throw error;
        }
    }

    /**
     * Sync social media settings
     */
    async syncSocialMedia() {
        try {
            const socialSettings = await settingsService.fetchSocial();
            const docRef = this.getGymProDataRef();

            await setDoc(docRef, {
                footer: {
                    socialMedia: {
                        facebook: (socialSettings as any)?.facebook || '',
                        instagram: (socialSettings as any)?.instagram || '',
                        twitter: (socialSettings as any)?.twitter || '',
                        youtube: (socialSettings as any)?.youtube || ''
                    }
                },
                updatedAt: new Date().toISOString()
            }, { merge: true });

            console.log('✅ Synced social media settings to website/gymProData');
        } catch (error) {
            console.error('❌ Error syncing social media settings:', error);
            throw error;
        }
    }
}

// Create singleton instance
export const websiteConfigService = new WebsiteConfigService();
