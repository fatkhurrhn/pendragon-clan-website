// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc'
            }}>
                <i className="ri-loader-4-line ri-spin" style={{ fontSize: '32px', color: '#3b82f6' }}></i>
            </div>
        );
    }

    if (!user) {
        // Simpan lokasi saat ini supaya setelah login kembali ke sini
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}