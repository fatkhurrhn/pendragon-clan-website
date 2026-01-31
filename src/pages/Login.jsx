// src/pages/Login.jsx - Tambahkan display error
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
    const { user, login, loading, authError } = useAuth(); // tambah authError
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        console.log("User state:", user?.email || "null"); // DEBUG
        if (user && !loading) {
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        }
    }, [user, loading, navigate, location]);

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '20px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                textAlign: 'center',
                maxWidth: '400px',
                width: '100%'
            }}>
                {/* TAMPILKAN ERROR KALAU ADA */}
                {authError && (
                    <div style={{
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '14px'
                    }}>
                        <i className="ri-error-warning-line"></i> {authError}
                    </div>
                )}

                <div style={{ marginBottom: '24px' }}>
                    <i className="ri-sword-line" style={{ fontSize: '48px', color: '#3b82f6' }}></i>
                </div>

                <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '8px' }}>
                    Welcome to Pendragon
                </h1>

                <p style={{ color: '#6b7280', marginBottom: '32px', fontSize: '14px' }}>
                    Upload and share your Clash of Clans base layouts
                </p>

                <button
                    onClick={login}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        padding: '12px',
                        borderRadius: '10px',
                        border: '1px solid #e5e7eb',
                        backgroundColor: '#fff',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '500'
                    }}
                >
                    <img
                        src="https://www.google.com/favicon.ico"
                        alt="Google"
                        style={{ width: '20px' }}
                    />
                    Continue with Google
                </button>


                {/* DEBUG INFO (hapus nanti kalau sudah works) */}
                {process.env.NODE_ENV === 'development' && (
                    <div style={{ marginTop: '20px', fontSize: '11px', color: '#9ca3af', textAlign: 'left' }}>
                        <p>Debug Info:</p>
                        <p>User: {user?.email || 'null'}</p>
                        <p>Loading: {loading ? 'true' : 'false'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}