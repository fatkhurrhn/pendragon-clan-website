// pages/UploadBase.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
// import { db, auth } from '../firebase';
import { db, auth } from '../../firebase';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';
import { extractTownHall } from '../utils/cocParser';
import { useAuth } from '../../context/AuthContext';

export default function UploadBase() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        layoutLink: '',
        category: '',
        tags: []
    });
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect kalau belum login
    useEffect(() => {
        if (!user && !loading) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLinkChange = (e) => {
        const link = e.target.value;
        const category = extractTownHall(link);
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
            // 1. Upload gambar ke Cloudinary dulu
            const imageUrl = await uploadToCloudinary(file);

            // 2. Simpan data ke Firestore
            await addDoc(collection(db, 'bases'), {
                layoutLink: formData.layoutLink,
                imageUrl: imageUrl,
                category: formData.category || extractTownHall(formData.layoutLink) || 'Unknown',
                tags: formData.tags,
                uploaderId: user.uid,
                uploaderName: user.displayName,
                uploaderPhoto: user.photoURL,
                createdAt: serverTimestamp(),
                views: 0
            });

            navigate('/');
        } catch (err) {
            setError(err.message || 'Gagal upload base');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc', padding: '20px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '24px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ri-upload-cloud-2-line"></i>
                        Upload Base Layout
                    </h1>

                    {error && (
                        <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
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
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                            />
                            {formData.category && (
                                <div style={{ marginTop: '6px', fontSize: '12px', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <i className="ri-check-line"></i>
                                    Terdeteksi: {formData.category}
                                </div>
                            )}
                        </div>

                        {/* Category Display (Read Only) */}
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

                        {/* File Upload */}
                        <div>
                            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '6px' }}>
                                Screenshot Base <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <div style={{
                                border: '2px dashed #d1d5db',
                                borderRadius: '12px',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'border-color 0.2s',
                                backgroundColor: preview ? '#f0fdf4' : 'transparent'
                            }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    required
                                    style={{ display: 'none' }}
                                    id="file-upload"
                                />
                                <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                    {preview ? (
                                        <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', marginBottom: '8px' }} />
                                    ) : (
                                        <>
                                            <i className="ri-image-add-line" style={{ fontSize: '32px', color: '#9ca3af', marginBottom: '8px' }}></i>
                                            <p style={{ fontSize: '14px', color: '#6b7280' }}>Klik untuk upload gambar</p>
                                        </>
                                    )}
                                </label>
                            </div>
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
                                            transition: 'all 0.2s',
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
                                gap: '8px',
                                transition: 'background-color 0.2s'
                            }}
                        >
                            {loading ? (
                                <>
                                    <i className="ri-loader-4-line ri-spin"></i>
                                    Mengupload...
                                </>
                            ) : (
                                <>
                                    <i className="ri-send-plane-fill"></i>
                                    Publish Base
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}