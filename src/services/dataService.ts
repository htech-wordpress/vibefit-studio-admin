import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { db } from '../config/firebase';

// Get project ID from environment variable
const getProjectId = () => {
    const projectId = import.meta.env.VITE_PROJECT_ID;
    if (!projectId) {
        throw new Error('VITE_PROJECT_ID is not defined in environment variables');
    }
    return projectId;
};

// Generic data service for any collection
export class DataService {
    private projectId: string;

    constructor() {
        this.projectId = getProjectId();
    }

    // Get collection reference
    private getCollectionRef(collectionName: string) {
        return collection(db, 'projects', this.projectId, collectionName);
    }

    // Get document reference
    private getDocRef(collectionName: string, docId: string) {
        return doc(db, 'projects', this.projectId, collectionName, docId);
    }

    // Fetch all documents from a collection
    async fetchAll(collectionName: string) {
        try {
            const collectionRef = this.getCollectionRef(collectionName);
            const q = query(collectionRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);

            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error(`Error fetching ${collectionName}:`, error);
            throw error;
        }
    }

    // Fetch a single document
    async fetchOne(collectionName: string, docId: string) {
        try {
            const docRef = this.getDocRef(collectionName, docId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                return {
                    id: docSnap.id,
                    ...docSnap.data()
                };
            }
            return null;
        } catch (error) {
            console.error(`Error fetching document from ${collectionName}:`, error);
            throw error;
        }
    }

    // Add a new document
    async add(collectionName: string, data: any) {
        try {
            const collectionRef = this.getCollectionRef(collectionName);
            const docRef = await addDoc(collectionRef, {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            });

            return docRef.id;
        } catch (error) {
            console.error(`Error adding document to ${collectionName}:`, error);
            throw error;
        }
    }

    // Update a document
    async update(collectionName: string, docId: string, data: any) {
        try {
            const docRef = this.getDocRef(collectionName, docId);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp()
            });
        } catch (error) {
            console.error(`Error updating document in ${collectionName}:`, error);
            throw error;
        }
    }

    // Delete a document
    async delete(collectionName: string, docId: string) {
        try {
            const docRef = this.getDocRef(collectionName, docId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error(`Error deleting document from ${collectionName}:`, error);
            throw error;
        }
    }
}

// Create singleton instance
export const dataService = new DataService();

// Specific service methods for different collections
export const customerService = {
    fetchAll: () => dataService.fetchAll('inquiries'),
    fetchOne: (id: string) => dataService.fetchOne('inquiries', id),
    update: (id: string, data: any) => dataService.update('inquiries', id, data),
    delete: (id: string) => dataService.delete('inquiries', id),
};

export const programService = {
    fetchAll: () => dataService.fetchAll('programs'),
    fetchOne: (id: string) => dataService.fetchOne('programs', id),
    add: (data: any) => dataService.add('programs', data),
    update: (id: string, data: any) => dataService.update('programs', id, data),
    delete: (id: string) => dataService.delete('programs', id),
};

export const galleryService = {
    fetchAll: () => dataService.fetchAll('gallery'),
    fetchOne: (id: string) => dataService.fetchOne('gallery', id),
    add: (data: any) => dataService.add('gallery', data),
    update: (id: string, data: any) => dataService.update('gallery', id, data),
    delete: (id: string) => dataService.delete('gallery', id),
};

export const testimonialService = {
    fetchAll: () => dataService.fetchAll('testimonials'),
    fetchOne: (id: string) => dataService.fetchOne('testimonials', id),
    add: (data: any) => dataService.add('testimonials', data),
    update: (id: string, data: any) => dataService.update('testimonials', id, data),
    delete: (id: string) => dataService.delete('testimonials', id),
};

export const settingsService = {
    fetchWhatsApp: () => dataService.fetchOne('settings', 'whatsapp'),
    updateWhatsApp: (data: any) => dataService.update('settings', 'whatsapp', data),

    fetchSocial: () => dataService.fetchOne('settings', 'social'),
    updateSocial: (data: any) => dataService.update('settings', 'social', data),
};
