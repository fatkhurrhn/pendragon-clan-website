// src/components/base/BaseCard.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, increment, deleteDoc } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useAuth } from '../../../context/AuthContext';
import { formatRelativeTime } from '../../utils/timeFormat';

export default function BaseCard({ base, isBookmarked, onToggleBookmark }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const isOwner = user?.uid === base.uploaderId;

    const handleCopyAndOpen = async () => {
        let link = base.layoutLink;
        if (link?.startsWith('clashofclans://')) {
            link = link.replace('clashofclans://', 'https://link.clashofclans.com/id?');
        }

        if (!link) {
            alert("Link tidak tersedia!");
            return;
        }

        const newWindow = window.open(link, '_blank');
        if (!newWindow) {
            alert("Popup diblok! Allow popup untuk site ini.");
            return;
        }

        try {
            await navigator.clipboard.writeText(link);
            await updateDoc(doc(db, 'bases', base.id), {
                views: increment(1)
            });
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Yakin hapus base ini?')) return;
        try {
            await deleteDoc(doc(db, 'bases', base.id));
        } catch (err) {
            alert('Gagal menghapus: ' + err.message);
        }
    };

    const thImage = `/img/town-hall-${base.category?.replace('TH', '') || '9'}.png`;

    return (
        <div style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 4px 15px rgba(15, 40, 84, 0.1)',
            border: '1px solid #BDE8F5',
            position: 'relative',
            transition: 'transform 0.2s',
            ':hover': {
                transform: 'translateY(-4px)'
            }
        }}>
            {/* Header - Profile Info */}
            <div style={{
                padding: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid #f0f9ff'
            }}>
                <img
                    src={base.uploaderPhoto || '/default-profile.jpg'}
                    alt={base.uploaderName}
                    style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #BDE8F5'
                    }}
                    onError={(e) => { e.target.src = '/default-profile.jpg'; }}
                />
                <div style={{ flex: 1 }}>
                    <h3 style={{
                        fontSize: '15px',
                        fontWeight: '700',
                        color: '#0F2854',
                        margin: 0,
                        lineHeight: 1.2
                    }}>
                        {base.uploaderName}
                    </h3>
                    <p style={{
                        fontSize: '12px',
                        color: '#4988C4',
                        margin: '2px 0 0 0',
                        fontFamily: 'monospace',
                        fontWeight: '600'
                    }}>
                        {base.uploaderPlayerId || '#000000000'}
                    </p>
                </div>
            </div>

            {/* Image Container */}
            <div style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '4/3',
                backgroundColor: '#f8fafc',
                overflow: 'hidden',
                cursor: 'pointer'
            }}
                onClick={handleCopyAndOpen}
            >
                <img
                    src={base.imageUrl}
                    alt="Base"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                />

                {/* Floating TH Icon - Bottom Right */}
                <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    width: '50px',
                    height: '50px',
                    borderRadius: '12px',
                    backgroundColor: 'rgba(255,255,255,0.95)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    border: '2px solid #BDE8F5'
                }}>
                    <img
                        src={thImage}
                        alt={base.category}
                        style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                    />
                </div>
            </div>

            {/* Action Center - Tombol 3 dots di tengah atas */}
            <div style={{ position: 'relative', height: '0' }}>
                <div style={{
                    position: 'absolute',
                    top: '-20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 10
                }}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            backgroundColor: 'white',
                            border: '2px solid #BDE8F5',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            color: '#0F2854',
                            transition: 'all 0.2s'
                        }}
                    >
                        <i className="ri-more-fill" style={{ fontSize: '20px' }}></i>
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div style={{
                            position: 'absolute',
                            top: 'calc(100% + 8px)',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            backgroundColor: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 10px 30px rgba(15, 40, 84, 0.2)',
                            border: '1px solid #BDE8F5',
                            minWidth: '140px',
                            overflow: 'hidden',
                            zIndex: 20
                        }}>
                            {isOwner ? (
                                <>
                                    <button
                                        onClick={() => navigate(`/edit/${base.id}`)}
                                        style={menuItemStyle('#0F2854')}
                                    >
                                        <i className="ri-edit-line"></i> Edit
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        style={menuItemStyle('#dc2626')}
                                    >
                                        <i className="ri-delete-bin-line"></i> Hapus
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => alert('Report feature coming soon!')}
                                    style={menuItemStyle('#dc2626')}
                                >
                                    <i className="ri-flag-line"></i> Report
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Bar - Rata Tengah */}
            <div style={{
                padding: '24px 16px 16px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '32px'
            }}>
                {/* Copy/Views */}
                <button onClick={handleCopyAndOpen} style={actionButtonStyle}>
                    <i className="ri-file-copy-line" style={{ fontSize: '20px' }}></i>
                    <span style={{ fontSize: '12px', fontWeight: '700' }}>{base.views || 0}</span>
                </button>

                {/* Share */}
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link copied!');
                    }}
                    style={actionButtonStyle}
                >
                    <i className="ri-share-forward-line" style={{ fontSize: '20px' }}></i>
                </button>

                {/* Time */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#4988C4',
                    fontSize: '12px',
                    fontWeight: '600'
                }}>
                    <i className="ri-time-line" style={{ fontSize: '18px' }}></i>
                    <span>{formatRelativeTime(base.createdAt)}</span>
                </div>

                {/* Bookmark */}
                <button
                    onClick={() => onToggleBookmark(base.id)}
                    style={{
                        ...actionButtonStyle,
                        color: isBookmarked ? '#f59e0b' : '#4988C4'
                    }}
                >
                    <i
                        className={isBookmarked ? 'ri-bookmark-fill' : 'ri-bookmark-line'}
                        style={{ fontSize: '20px' }}
                    ></i>
                </button>
            </div>
        </div>
    );
}

const menuItemStyle = (color) => ({
    width: '100%',
    padding: '10px 16px',
    border: 'none',
    background: 'none',
    textAlign: 'left',
    fontSize: '13px',
    color: color,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '600',
    transition: 'background 0.2s',
    ':hover': {
        backgroundColor: '#f8fafc'
    }
});

const actionButtonStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '2px',
    background: 'none',
    border: 'none',
    color: '#4988C4',
    cursor: 'pointer',
    padding: '4px',
    transition: 'color 0.2s',
    ':hover': {
        color: '#0F2854'
    }
};