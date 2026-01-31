import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc, increment, where, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { formatRelativeTime } from '../utils/timeFormat';

export default function BaseHome() {
  const [bases, setBases] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [activeMenu, setActiveMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  // Load bookmarks dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pendragon_bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  // Close menu saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('[data-menu]')) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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
      setLoading(false);
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
    let link = base.layoutLink;
    if (link && link.startsWith('clashofclans://')) {
      link = link.replace('clashofclans://', 'https://link.clashofclans.com/id?');
    }

    if (!link) {
      alert("Link layout tidak tersedia!");
      return;
    }

    try {
      const newWindow = window.open(link, '_blank');
      if (!newWindow) {
        alert("Popup diblok! Allow popup untuk site ini.");
        return;
      }

      await navigator.clipboard.writeText(link);
      
      await updateDoc(doc(db, 'bases', base.id), {
        views: increment(1)
      });
    } catch (err) {
      console.error('Error:', err);
      window.open(link, '_blank');
    }
  };

  const handleDelete = async (baseId) => {
    if (!window.confirm('Yakin mau hapus base ini? Tindakan ini tidak bisa dibatalkan.')) {
      return;
    }

    try {
      await deleteDoc(doc(db, 'bases', baseId));
      setActiveMenu(null);
    } catch (error) {
      console.error('Error deleting base:', error);
      alert('Gagal menghapus base: ' + error.message);
    }
  };

  const handleShare = async (base) => {
    const shareData = {
      title: `Base ${base.category} by ${base.uploaderName}`,
      text: `Check out this ${base.category} base layout!`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link halaman ini sudah di-copy!');
      }
    } catch (err) {
      console.error('Share failed:', err);
    }
  };

  // Filter bases
  const filteredBases = bases.filter(base => {
    const matchCategory = selectedCategory === 'All' || base.category === selectedCategory;
    const matchTag = selectedTag === 'All' || (Array.isArray(base.tags) && base.tags.includes(selectedTag));
    return matchCategory && matchTag;
  });

  const categories = ['All', ...new Set(bases.map(b => b.category).filter(Boolean))];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
        <i className="ri-loader-4-line ri-spin" style={{ fontSize: '32px', color: '#3b82f6' }}></i>
      </div>
    );
  }

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
                  src={userData?.photoURL || user?.photoURL || '/default-profile.jpg'} 
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
                  cursor: 'pointer'
                }}
              >
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
                whiteSpace: 'nowrap'
              }}
            >
              {cat === 'All' ? 'Semua' : cat}
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

        {/* Grid Base Layouts */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', 
          gap: '24px' 
        }}>
          {filteredBases.map(base => (
            <div key={base.id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '16px', 
              overflow: 'hidden',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #f3f4f6'
            }}>
              {/* Header Profile */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '16px 16px 12px 16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <img 
                    src={base.uploaderPhoto || '/default-profile.jpg'} 
                    alt={base.uploaderName}
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #f3f4f6'
                    }}
                    onError={(e) => { e.target.src = '/default-profile.jpg'; }}
                  />
                  <div>
                    <h3 style={{ 
                      fontSize: '15px', 
                      fontWeight: '700', 
                      color: '#111827',
                      margin: 0
                    }}>
                      {base.uploaderName}
                    </h3>
                    <p style={{ 
                      fontSize: '13px', 
                      color: '#6b7280',
                      margin: '2px 0 0 0',
                      fontFamily: 'monospace'
                    }}>
                      {base.uploaderPlayerId || '#000000000'}
                    </p>
                  </div>
                </div>
                
                {/* Menu 3 Dots - Hanya untuk pemilik */}
                {user?.uid === base.uploaderId && (
                  <div style={{ position: 'relative' }} data-menu>
                    <button
                      onClick={() => setActiveMenu(activeMenu === base.id ? null : base.id)}
                      style={{
                        background: 'none',
                        border: 'none',
                        padding: '8px',
                        cursor: 'pointer',
                        color: '#9ca3af',
                        borderRadius: '8px'
                      }}
                    >
                      <i className="ri-more-fill" style={{ fontSize: '24px' }}></i>
                    </button>
                    
                    {activeMenu === base.id && (
                      <div style={{
                        position: 'absolute',
                        right: 0,
                        top: '100%',
                        marginTop: '4px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        border: '1px solid #e5e7eb',
                        zIndex: 10,
                        minWidth: '120px',
                        overflow: 'hidden'
                      }}>
                        <button
                          onClick={() => navigate(`/edit/${base.id}`)}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            fontSize: '14px',
                            color: '#374151',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <i className="ri-edit-line"></i> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(base.id)}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            border: 'none',
                            background: 'none',
                            textAlign: 'left',
                            fontSize: '14px',
                            color: '#dc2626',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                          }}
                        >
                          <i className="ri-delete-bin-line"></i> Hapus
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Image */}
              <div style={{ 
                position: 'relative',
                width: '100%',
                paddingBottom: '75%',
                backgroundColor: '#f3f4f6',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
              onClick={() => handleCopyAndOpen(base)}
              >
                <img 
                  src={base.imageUrl} 
                  alt="Base Layout" 
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
                <div style={{ 
                  position: 'absolute', 
                  top: '12px', 
                  left: '12px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '700'
                }}>
                  {base.category}
                </div>
              </div>

              {/* Action Bar */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderTop: '1px solid #f3f4f6'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Views/Copy Count */}
                  <button
                    onClick={() => handleCopyAndOpen(base)}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: '#4b5563',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="ri-stack-line" style={{ fontSize: '20px' }}></i>
                    <span style={{ fontWeight: '600' }}>{base.views || 0}</span>
                  </button>

                  {/* Share */}
                  <button
                    onClick={() => handleShare(base)}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      color: '#4b5563',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="ri-share-forward-line" style={{ fontSize: '20px' }}></i>
                  </button>

                  {/* Time */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#6b7280',
                    fontSize: '13px'
                  }}>
                    <i className="ri-time-line" style={{ fontSize: '18px' }}></i>
                    <span>{formatRelativeTime(base.createdAt)}</span>
                  </div>
                </div>

                {/* Bookmark */}
                <button
                  onClick={() => toggleBookmark(base.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: bookmarks.includes(base.id) ? '#f59e0b' : '#9ca3af'
                  }}
                >
                  <i 
                    className={bookmarks.includes(base.id) ? 'ri-bookmark-fill' : 'ri-bookmark-line'} 
                    style={{ fontSize: '22px' }}
                  ></i>
                </button>
              </div>

              {/* Tags */}
              {Array.isArray(base.tags) && base.tags.length > 0 && (
                <div style={{ 
                  padding: '0 16px 12px 16px', 
                  display: 'flex', 
                  gap: '6px',
                  marginTop: '-4px'
                }}>
                  {base.tags.map(tag => (
                    <span key={tag} style={{
                      fontSize: '11px',
                      padding: '3px 8px',
                      backgroundColor: tag === 'umum' ? '#dbeafe' : '#fce7f3',
                      color: tag === 'umum' ? '#1e40af' : '#be185d',
                      borderRadius: '4px',
                      textTransform: 'capitalize'
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredBases.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6b7280' }}>
            <i className="ri-folder-open-line" style={{ fontSize: '48px', marginBottom: '16px' }}></i>
            <p>Belum ada base yang diupload</p>
          </div>
        )}
      </div>
    </div>
  );
}