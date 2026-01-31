// pages/Profile.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { doc, updateDoc, serverTimestamp, writeBatch, collection, query, where, getDocs } from 'firebase/firestore';

export default function Profile() {
    const { user, userData, loading, refreshUserData } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        playerName: '',
        playerId: '',
        photoURL: ''
    });
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }

        if (userData) {
            setFormData({
                playerName: userData.playerName || userData.displayName || '',
                playerId: userData.playerId || '',
                photoURL: userData.photoURL || '/default-profile.jpg'
            });
        }
    }, [user, userData, loading, navigate]);

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingPhoto(true);
        setMessage({ type: '', text: '' });

        try {
            const imageUrl = await uploadToCloudinary(file);
            setFormData(prev => ({ ...prev, photoURL: imageUrl }));
            setMessage({ type: 'success', text: 'Foto berhasil diupload, jangan lupa simpan perubahan!' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Gagal upload foto: ' + error });
        } finally {
            setUploadingPhoto(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setSaving(true);
        setMessage({ type: '', text: '' });

        try {
            // Validasi Player ID
            const playerIdRegex = /^#[A-Z0-9]{6,10}$/;
            if (formData.playerId && !playerIdRegex.test(formData.playerId)) {
                throw new Error('Format Player ID harus # diikuti 6-10 karakter');
            }

            // 1. Update profile user
            await updateDoc(doc(db, 'users', user.uid), {
                playerName: formData.playerName.trim() || userData.displayName,
                playerId: formData.playerId.toUpperCase(),
                photoURL: formData.photoURL || '/default-profile.jpg',
                updatedAt: serverTimestamp()
            });

            // 2. UPDATE SEMUA BASE YANG PERNAH DIUPLOAD (TAMBAH INI)
            const basesQuery = query(
                collection(db, 'bases'),
                where('uploaderId', '==', user.uid)
            );
            const basesSnapshot = await getDocs(basesQuery);

            if (!basesSnapshot.empty) {
                const batch = writeBatch(db);

                basesSnapshot.docs.forEach((baseDoc) => {
                    const baseRef = doc(db, 'bases', baseDoc.id);
                    batch.update(baseRef, {
                        uploaderName: formData.playerName.trim() || userData.displayName,
                        uploaderPhoto: formData.photoURL || '/default-profile.jpg',
                        uploaderPlayerId: formData.playerId.toUpperCase()
                    });
                });

                await batch.commit();
                console.log(`Updated ${basesSnapshot.docs.length} bases`);
            }

            await refreshUserData();
            setMessage({ type: 'success', text: 'Profil & semua base berhasil diperbarui!' });

        } catch (error) {
            console.error('Error:', error);
            setMessage({ type: 'error', text: error.message });
        } finally {
            setSaving(false);
        }
    };

    if (loading || !userData) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
                <i className="ri-loader-4-line ri-spin" style={{ fontSize: '32px', color: '#3b82f6' }}></i>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            color: '#6b7280',
                            padding: '8px',
                            borderRadius: '8px',
                            transition: 'background 0.2s'
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = '#e5e7eb'}
                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                    >
                        <i className="ri-arrow-left-line"></i>
                    </button>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                        Edit Profil
                    </h1>
                </div>

                {/* Message */}
                {message.text && (
                    <div style={{
                        padding: '12px 16px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
                        color: message.type === 'success' ? '#065f46' : '#dc2626',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <i className={message.type === 'success' ? 'ri-check-line' : 'ri-error-warning-line'}></i>
                        {message.text}
                    </div>
                )}

                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

                    {/* Foto Profil Section */}
                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                            <img
                                src={formData.photoURL || '/default-profile.jpg'}
                                alt="Profile"
                                style={{
                                    width: '120px',
                                    height: '120px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '4px solid #e5e7eb'
                                }}
                                onError={(e) => {
                                    e.target.src = '/default-profile.jpg';
                                }}
                            />
                            <label
                                htmlFor="photo-upload"
                                style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    right: '0',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                                    border: '3px solid white'
                                }}
                            >
                                {uploadingPhoto ? (
                                    <i className="ri-loader-4-line ri-spin" style={{ fontSize: '16px' }}></i>
                                ) : (
                                    <i className="ri-camera-line" style={{ fontSize: '16px' }}></i>
                                )}
                            </label>
                            <input
                                type="file"
                                id="photo-upload"
                                accept="image/*"
                                onChange={handlePhotoUpload}
                                disabled={uploadingPhoto}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                            Klik ikon kamera untuk ganti foto
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Data Google (Read Only) */}
                        <div style={{ backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '12px' }}>
                            <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <i className="ri-google-fill" style={{ color: '#4285F4' }}></i>
                                Data Akun Google (Tidak bisa diubah)
                            </h3>

                            <div style={{ marginBottom: '12px' }}>
                                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                    Email
                                </label>
                                <div style={{
                                    padding: '10px',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    color: '#6b7280',
                                    fontSize: '14px'
                                }}>
                                    {userData?.email}
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                                    Nama Google
                                </label>
                                <div style={{
                                    padding: '10px',
                                    backgroundColor: 'white',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    color: '#6b7280',
                                    fontSize: '14px'
                                }}>
                                    {userData?.displayName}
                                </div>
                            </div>
                        </div>

                        {/* Player Name (Editable) */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                                Player Name <span style={{ color: '#ef4444' }}>*</span>
                                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal', marginLeft: '8px' }}>
                                    (Nama yang ditampilkan di base layout)
                                </span>
                            </label>
                            <input
                                type="text"
                                name="playerName"
                                value={formData.playerName}
                                onChange={handleChange}
                                placeholder="Nama panggilan di game"
                                maxLength={20}
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    fontSize: '14px',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                Maksimal 20 karakter. Ini yang akan terlihat oleh pengguna lain.
                            </p>
                        </div>

                        {/* Player ID COC (Editable) */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                                Player ID COC
                                <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'normal', marginLeft: '8px' }}>
                                    (Opsional)
                                </span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute',
                                    left: '12px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#6b7280',
                                    fontWeight: 'bold'
                                }}>#</span>
                                <input
                                    type="text"
                                    name="playerId"
                                    value={formData.playerId.replace('#', '')}
                                    onChange={(e) => {
                                        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
                                        setFormData(prev => ({ ...prev, playerId: value ? `#${value}` : '' }));
                                    }}
                                    placeholder="2Y29VCP89"
                                    maxLength={10}
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 28px',
                                        borderRadius: '8px',
                                        border: '1px solid #e5e7eb',
                                        fontSize: '14px',
                                        outline: 'none',
                                        fontFamily: 'monospace',
                                        letterSpacing: '1px'
                                    }}
                                />
                            </div>
                            <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                ID unik akun COC kamu. Bisa dilihat di profil game (Settings -&gt; More Settings).
                            </p>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={saving || uploadingPhoto}
                            style={{
                                marginTop: '10px',
                                padding: '14px',
                                backgroundColor: saving ? '#9ca3af' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: saving ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            {saving ? (
                                <>
                                    <i className="ri-loader-4-line ri-spin"></i>
                                    Menyimpan...
                                </>
                            ) : (
                                <>
                                    <i className="ri-save-line"></i>
                                    Simpan Perubahan
                                </>
                            )}
                        </button>

                    </form>
                </div>

                {/* Base yang pernah diupload */}
                <div style={{ marginTop: '24px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>
                        Base yang Kamu Upload
                    </h2>
                    <UserBases userId={user.uid} />
                </div>

            </div>
        </div>
    );
}

// Komponen untuk menampilkan base user
function UserBases({ userId }) {
    const [bases, setBases] = useState([]);

    useEffect(() => {
        // Fetch bases by userId
        // Implementation depends on your data structure
    }, [userId]);

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            color: '#6b7280'
        }}>
            <i className="ri-folders-line" style={{ fontSize: '32px', marginBottom: '8px', display: 'block' }}></i>
            Fitur riwayat base akan segera hadir
        </div>
    );
}