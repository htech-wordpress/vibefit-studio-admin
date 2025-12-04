import { useState, useEffect, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
    children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [hasAccess, setHasAccess] = useState(false);

    useEffect(() => {
        const unsubscribe = authService.onAuthStateChange(async (user) => {
            if (user) {
                // Verify user has access to this project
                const access = await authService.verifyUserAccess(user.uid);
                setHasAccess(access);
                setAuthenticated(true);
            } else {
                setAuthenticated(false);
                setHasAccess(false);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                fontSize: '1.125rem',
                color: '#6b7280'
            }}>
                Verifying access...
            </div>
        );
    }

    if (!authenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!hasAccess) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#ef4444', marginBottom: '1rem' }}>
                    Access Denied
                </h1>
                <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
                    You do not have permission to access this admin panel.
                </p>
                <button
                    onClick={() => authService.logout()}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.5rem',
                        cursor: 'pointer',
                        fontWeight: '600'
                    }}
                >
                    Logout
                </button>
            </div>
        );
    }

    return <>{children}</>;
}
