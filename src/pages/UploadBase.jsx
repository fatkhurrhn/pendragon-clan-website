// pages/UploadBase.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { collection, addDoc, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { extractTownHall } from '../utils/cocParser';
import { useAuth } from '../../context/AuthContext';

const normalizeCOCLink = (link) => {
    if (!link) return link;
    if (link.startsWith('https://link.clashofclans.com/')) return link;
    if (link.startsWith('clashofclans://')) {
        return link.replace('clashofclans://', 'https://link.clashofclans.com/id?');
    }
    return link;
};

export default function UploadBase({ mode = 'create' }) {
    const { id } = useParams(); // Ambil ID kalau mode edit
    const isEditMode = mode === 'edit' && id;

    const { user, userData } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        layoutLink: '',
        category: '',
        tags: []
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [existingImage, setExistingImage] = useState(null); // Untuk mode edit
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [fetchLoading, setFetchLoading] = useState(isEditMode);

    // Fetch data kalau mode edit
    useEffect(() => {
        if (isEditMode) {
            const fetchBase = async () => {
                try {
                    const baseDoc = await getDoc(doc(db, 'bases', id));
                    if (baseDoc.exists()) {
                        const data = baseDoc.data();

                        // Cek apakah user yang login adalah pemiliknya
                        if (data.uploaderId !== user?.uid) {
                            alert('Kamu tidak punya izin edit base ini!');
                            navigate('/');
                            return;
                        }

                        setFormData({
                            layoutLink: data.layoutLink,
                            category: data.category,
                            tags: data.tags || []
                        });
                        setExistingImage(data.imageUrl);
                        setPreview(data.imageUrl);
                    } else {
                        alert('Base tidak ditemukan!');
                        navigate('/');
                    }
                } catch (err) {
                    console.error('Error fetching base:', err);
                    alert('Gagal memuat data base');
                } finally {
                    setFetchLoading(false);
                }
            };

            fetchBase();
        }
    }, [isEditMode, id, user, navigate]);

    const handleLinkChange = (e) => {
        const link = e.target.value;
        const normalized = normalizeCOCLink(link);
        const category = extractTownHall(normalized);

        setFormData(prev => ({
            ...prev,
            layoutLink: link,
            category: category || prev.category
        }));
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleTagToggle = (tag) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        setLoading(true);
        setError('');

        try {
            const normalizedLink = normalizeCOCLink(formData.layoutLink);
            let imageUrl = existingImage; // Default pakai gambar lama (edit mode)

            // Kalau ada file baru, upload ke Cloudinary
            if (file) {
                imageUrl = await uploadToCloudinary(file);
            }

            if (isEditMode) {
                // MODE EDIT: Update dokumen yang ada
                await updateDoc(doc(db, 'bases', id), {
                    layoutLink: normalizedLink,
                    imageUrl: imageUrl,
                    category: formData.category || extractTownHall(normalizedLink) || 'Unknown',
                    tags: formData.tags,
                    updatedAt: serverTimestamp()
                });

                alert('Base berhasil diupdate!');
            } else {
                // MODE CREATE: Buat dokumen baru
                await addDoc(collection(db, 'bases'), {
                    layoutLink: normalizedLink,
                    imageUrl: imageUrl,
                    category: formData.category || extractTownHall(normalizedLink) || 'Unknown',
                    tags: formData.tags,
                    uploaderId: user.uid,
                    uploaderName: userData?.playerName || user.displayName,
                    uploaderPhoto: userData?.photoURL || user.photoURL,
                    uploaderPlayerId: userData?.playerId || '',
                    createdAt: serverTimestamp(),
                    views: 0
                });

                alert('Base berhasil diupload!');
            }

            navigate('/');
        } catch (err) {
            console.error(err);
            setError(err.message || `Gagal ${isEditMode ? 'update' : 'upload'} base`);
        } finally {
            setLoading(false);
        }
    };

    // Loading state saat fetch data edit
    if (fetchLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
                <i className="ri-loader-4-line ri-spin" style={{ fontSize: '32px', color: '#3b82f6' }}></i>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>

                {/* Header dengan Tombol Kembali */}
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
                            borderRadius: '8px'
                        }}
                    >
                        <i className="ri-arrow-left-line"></i>
                    </button>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>
                        {isEditMode ? 'Edit Base Layout' : 'Upload Base Layout'}
                    </h1>
                </div>

                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>

                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                            <i className="ri-error-warning-line" style={{ marginRight: '6px' }}></i>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Layout Link Input */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                                Link Layout COC <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                type="url"
                                required
                                placeholder="https://link.clashofclans.com/..."
                                value={formData.layoutLink}
                                onChange={handleLinkChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #e5e7eb',
                                    fontSize: '14px',
                                    outline: 'none'
                                }}
                            />
                            {formData.category && (
                                <div style={{ marginTop: '6px', fontSize: '12px', color: '#059669' }}>
                                    <i className="ri-check-line"></i> Terdeteksi: {formData.category}
                                </div>
                            )}
                        </div>

                        {/* Category Display */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                                Kategori Base
                            </label>
                            <div style={{
                                padding: '12px',
                                backgroundColor: '#f3f4f6',
                                borderRadius: '8px',
                                border: '1px solid #e5e7eb',
                                color: formData.category ? '#111827' : '#9ca3af',
                                fontSize: '14px'
                            }}>
                                {formData.category || 'Otomatis terisi setelah paste link'}
                            </div>
                        </div>

                        {/* File Upload - Judul berbeda untuk edit */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374141', marginBottom: '6px' }}>
                                {isEditMode ? 'Ganti Foto (Opsional)' : 'Screenshot Base'}
                                {!isEditMode && <span style={{ color: '#ef4444' }}>*</span>}
                            </label>
                            <div style={{
                                border: '2px dashed #d1d5db',
                                borderRadius: '12px',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                backgroundColor: preview ? '#f0fdf4' : 'transparent'
                            }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    id="file-upload"
                                    required={!isEditMode} // Kalau edit, tidak wajib ganti foto
                                />
                                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                    {preview ? (
                                        <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                                    ) : (
                                        <>
                                            <i className="ri-image-add-line" style={{ fontSize: '32px', color: '#9ca3af' }}></i>
                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>Klik untuk {isEditMode ? 'ganti' : 'upload'} gambar</p>
                                        </>
                                    )}
                                </label>
                            </div>
                            {isEditMode && existingImage && !file && (
                                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '6px' }}>
                                    *Kosongkan jika tidak ingin mengganti foto yang sudah ada
                                </p>
                            )}
                        </div>

                        {/* Tags Selection */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '10px' }}>
                                Tag Base
                            </label>
                            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                {['umum', 'fun'].map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => handleTagToggle(tag)}
                                        style={{
                                            padding: '8px 16px',
                                            borderRadius: '20px',
                                            border: '1px solid #e5e7eb',
                                            backgroundColor: formData.tags.includes(tag) ? '#3b82f6' : 'white',
                                            color: formData.tags.includes(tag) ? 'white' : '#374151',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            textTransform: 'capitalize',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px'
                                        }}
                                    >
                                        <i className={formData.tags.includes(tag) ? 'ri-check-line' : 'ri-add-line'}></i>
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '10px',
                                padding: '14px',
                                backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            {loading ? (
                                <>
                                    <i className="ri-loader-4-line ri-spin"></i>
                                    {isEditMode ? 'Menyimpan...' : 'Mengupload...'}
                                </>
                            ) : (
                                <>
                                    <i className={isEditMode ? 'ri-save-line' : 'ri-send-plane-fill'}></i>
                                    {isEditMode ? 'Simpan Perubahan' : 'Publish Base'}
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}