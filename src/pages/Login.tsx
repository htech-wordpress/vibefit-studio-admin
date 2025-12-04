import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';
import { authService } from '../services/authService';
import styles from './Login.module.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        try {
            setLoading(true);
            await authService.login(email, password);
            navigate('/');
        } catch (err: any) {
            setError(err.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <div className={styles.logo}>
                        <Dumbbell className={styles.logoIcon} />
                    </div>
                    <h1 className={styles.title}>Gym Admin Panel</h1>
                    <p className={styles.subtitle}>Sign in to manage your gym</p>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    {error && (
                        <div className={styles.error}>
                            {error}
                        </div>
                    )}

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Email Address</label>
                        <input
                            type="email"
                            className={styles.input}
                            placeholder="admin@gym.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>Password</label>
                        <input
                            type="password"
                            className={styles.input}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>© 2025 Gym Admin Panel</p>
                </div>
            </div>
        </div>
    );
}
