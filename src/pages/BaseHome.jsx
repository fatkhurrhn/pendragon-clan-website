// pages/BaseHome.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { formatRelativeTime } from '../utils/timeFormat';
import { useNavigate } from 'react-router-dom';

export default function BaseHome() {
    const [bases, setBases] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedTag, setSelectedTag] = useState('All');
    const { user } = useAuth();
    const navigate = useNavigate();

    // Load bookmarks dari localStorage
    useEffect(() => {
        const saved = localStorage.getItem('pendragon_bookmarks');
        if (saved) {
            setBookmarks(JSON.parse(saved));
        }
    }, []);

    // Subscribe ke Firestore
    useEffect(() => {
        const q = query(collection(db, 'bases'), orderBy('createdAt', 'desc'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const basesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setBases(basesData);
        });

        return () => unsubscribe();
    }, []);

    const toggleBookmark = (baseId) => {
        const newBookmarks = bookmarks.includes(baseId)
            ? bookmarks.filter(id => id !== baseId)
            : [...bookmarks, baseId];

        setBookmarks(newBookmarks);
        localStorage.setItem('pendragon_bookmarks', JSON.stringify(newBookmarks));
    };

    const handleCopyAndOpen = async (base) => {
        // Konversi kalau masih format lama
        let link = base.layoutLink;
        if (link && link.startsWith('clashofclans://')) {
            link = link.replace('clashofclans://', 'https://link.clashofclans.com/id?');
        }

        if (!link) {
            alert("Link layout tidak tersedia!");
            return;
        }

        try {
            await navigator.clipboard.writeText(link);
            window.open(link, '_blank');

            await updateDoc(doc(db, 'bases', base.id), {
                views: increment(1)
            });
        } catch (err) {
            console.error('Error:', err);
        }
    };

    const handleDelete = async (baseId) => {
        if (window.confirm('Yakin mau hapus base ini?')) {
            await deleteDoc(doc(db, 'bases', baseId));
        }
    };

    // Filter bases
    const filteredBases = bases.filter(base => {
        const matchCategory = selectedCategory === 'All' || base.category === selectedCategory;
        const matchTag = selectedTag === 'All' || base.tags.includes(selectedTag);
        return matchCategory && matchTag;
    });

    // Extract unique categories
    const categories = ['All', ...new Set(bases.map(b => b.category).filter(Boolean))];

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            {/* Navbar */}
            <nav style={{
                backgroundColor: 'white',
                borderBottom: '1px solid #e5e7eb',
                padding: '16px 20px',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h1 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="ri-sword-line" style={{ color: '#3b82f6' }}></i>
                        Pendragon
                    </h1>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        {user ? (
                            <>
                                <button
                                    onClick={() => navigate('/upload')}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontSize: '14px',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '6px'
                                    }}
                                >
                                    <i className="ri-add-line"></i>
                                    Upload
                                </button>
                                <img
                                    src={user.photoURL}
                                    alt="Profile"
                                    style={{ width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}
                                    onClick={() => navigate('/profile')}
                                />
                            </>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                style={{
                                    padding: '8px 16px',
                                    backgroundColor: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontSize: '14px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px'
                                }}
                            >
                                <i className="ri-google-fill"></i>
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {/* Filter Section */}
            <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '8px', marginBottom: '20px' }}>
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: 'none',
                                backgroundColor: selectedCategory === cat ? '#3b82f6' : '#e5e7eb',
                                color: selectedCategory === cat ? 'white' : '#374151',
                                fontSize: '14px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                                transition: 'all 0.2s'
                            }}
                        >
                            {cat === 'All' ? 'Semua Kategori' : cat}
                        </button>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                    {['All', 'umum', 'fun'].map(tag => (
                        <button
                            key={tag}
                            onClick={() => setSelectedTag(tag)}
                            style={{
                                padding: '6px 12px',
                                borderRadius: '16px',
                                border: '1px solid #e5e7eb',
                                backgroundColor: selectedTag === tag ? '#10b981' : 'white',
                                color: selectedTag === tag ? 'white' : '#6b7280',
                                fontSize: '13px',
                                cursor: 'pointer',
                                textTransform: 'capitalize'
                            }}
                        >
                            {tag === 'All' ? 'Semua Tag' : tag}
                        </button>
                    ))}
                </div>

                {/* Grid Layout */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px'
                }}>
                    {filteredBases.map(base => (
                        <div key={base.id} style={{
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s',
                            border: '1px solid #e5e7eb'
                        }}>
                            {/* Image */}
                            <div style={{ position: 'relative', height: '200px', overflow: 'hidden' }}>
                                <img
                                    src={base.imageUrl}
                                    alt="Base Layout"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                    color: 'white',
                                    padding: '4px 12px',
                                    borderRadius: '12px',
                                    fontSize: '12px',
                                    fontWeight: '600'
                                }}>
                                    {base.category}
                                </div>

                                {/* Edit/Delete buttons hanya untuk uploader */}
                                {user?.uid === base.uploaderId && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '12px',
                                        left: '12px',
                                        display: 'flex',
                                        gap: '8px'
                                    }}>
                                        <button
                                            onClick={() => {/* Logic edit */ }}
                                            style={{
                                                backgroundColor: '#fbbf24',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '6px',
                                                cursor: 'pointer',
                                                color: 'white'
                                            }}
                                        >
                                            <i className="ri-edit-line"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(base.id)}
                                            style={{
                                                backgroundColor: '#ef4444',
                                                border: 'none',
                                                borderRadius: '6px',
                                                padding: '6px',
                                                cursor: 'pointer',
                                                color: 'white'
                                            }}
                                        >
                                            <i className="ri-delete-bin-line"></i>
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div style={{ padding: '16px' }}>
                                {/* Tags */}
                                <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                                    {(Array.isArray(base.tags) ? base.tags : [])
                                        .filter(tag => tag && typeof tag === 'string')
                                        .map(tag => (
                                            <span key={tag} style={{
                                                fontSize: '11px',
                                                padding: '2px 8px',
                                                backgroundColor: tag === 'umum' ? '#dbeafe' : '#fce7f3',
                                                color: tag === 'umum' ? '#1e40af' : '#be185d',
                                                borderRadius: '10px',
                                                textTransform: 'capitalize'
                                            }}>
                                                {tag}
                                            </span>
                                        ))}
                                </div>

                                {/* User Info & Time */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                    <img
                                        src={base.uploaderPhoto}
                                        alt={base.uploaderName}
                                        style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                                    />
                                    <span style={{ fontSize: '13px', color: '#374151', fontWeight: '500' }}>
                                        {base.uploaderName}
                                    </span>
                                    <span style={{ color: '#9ca3af', fontSize: '12px' }}>•</span>
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>
                                        {formatRelativeTime(base.createdAt)}
                                    </span>
                                </div>

                                {/* Views Count */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    fontSize: '12px',
                                    color: '#6b7280',
                                    marginBottom: '12px'
                                }}>
                                    <i className="ri-eye-line"></i>
                                    <span>{base.views || 0} views</span>
                                </div>

                                {/* Action Buttons */}
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        onClick={() => handleCopyAndOpen(base)}
                                        style={{
                                            flex: 1,
                                            padding: '10px',
                                            backgroundColor: '#3b82f6',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontSize: '14px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '6px',
                                            fontWeight: '500'
                                        }}
                                    >
                                        <i className="ri-file-copy-line"></i>
                                        Salin & Buka
                                    </button>

                                    <button
                                        onClick={() => toggleBookmark(base.id)}
                                        style={{
                                            padding: '10px',
                                            backgroundColor: bookmarks.includes(base.id) ? '#fef3c7' : '#f3f4f6',
                                            color: bookmarks.includes(base.id) ? '#d97706' : '#6b7280',
                                            border: 'none',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <i className={bookmarks.includes(base.id) ? 'ri-bookmark-fill' : 'ri-bookmark-line'}></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredBases.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
                        <i className="ri-folder-open-line" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
                        <p>Belum ada base yang diupload</p>
                    </div>
                )}
            </div>
        </div>
    );
}