import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    type User
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

interface UserRole {
    role: string;
    projectId: string;
    email: string;
    createdAt?: any;
}

export const authService = {
    // Sign in with email and password
    login: async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Verify user role and project access
            const hasAccess = await authService.verifyUserAccess(user.uid);

            if (!hasAccess) {
                await signOut(auth);
                throw new Error('You do not have access to this admin panel');
            }

            return user;
        } catch (error: any) {
            console.error('Login error:', error);
            throw new Error(error.message || 'Failed to login');
        }
    },

    // Verify user has access to this project
    verifyUserAccess: async (userId: string): Promise<boolean> => {
        try {
            const projectId = import.meta.env.VITE_PROJECT_ID;

            if (!projectId) {
                console.error('VITE_PROJECT_ID not configured');
                return false;
            }

            // Check if user document exists in users collection
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);

            if (!userDoc.exists()) {
                console.error('User not found in this project');
                return false;
            }

            const userData = userDoc.data() as UserRole;

            // Verify user has admin role
            if (userData.role !== 'admin') {
                console.error('User does not have admin role');
                return false;
            }

            // Verify project ID matches
            if (userData.projectId !== projectId) {
                console.error('User project ID does not match');
                return false;
            }

            console.log('✅ User access verified for project:', projectId);
            return true;
        } catch (error) {
            console.error('Error verifying user access:', error);
            return false;
        }
    },

    // Get user role and project info
    getUserRole: async (userId: string): Promise<UserRole | null> => {
        try {
            const projectId = import.meta.env.VITE_PROJECT_ID;
            const userDocRef = doc(db, 'users', userId);
            const userDoc = await getDoc(userDocRef);

            if (userDoc.exists()) {
                const userData = userDoc.data() as UserRole;
                // Verify this user belongs to the current project
                if (userData.projectId === projectId) {
                    return userData;
                }
            }
            return null;
        } catch (error) {
            console.error('Error getting user role:', error);
            return null;
        }
    },

    // Sign out
    logout: async () => {
        try {
            await signOut(auth);
        } catch (error: any) {
            console.error('Logout error:', error);
            throw new Error(error.message || 'Failed to logout');
        }
    },

    // Get current user
    getCurrentUser: (): User | null => {
        return auth.currentUser;
    },

    // Listen to auth state changes
    onAuthStateChange: (callback: (user: User | null) => void) => {
        return onAuthStateChanged(auth, callback);
    }
};
