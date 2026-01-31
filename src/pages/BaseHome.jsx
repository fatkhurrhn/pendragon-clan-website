// src/pages/BaseHome.jsx
import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../components/layout/Navbar';
import FilterTags from '../components/filter/FilterTags';
import BaseGrid from '../components/base/BaseGrid';

export default function BaseHome() {
    const [bases, setBases] = useState([]);
    const [bookmarks, setBookmarks] = useState([]);
    const [selectedTH, setSelectedTH] = useState('All');
    const [selectedTag, setSelectedTag] = useState('All');
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    // Load bookmarks
    useEffect(() => {
        const saved = localStorage.getItem('pendragon_bookmarks');
        if (saved) setBookmarks(JSON.parse(saved));
    }, []);

    // Subscribe bases dengan filter
    useEffect(() => {
        let q = query(collection(db, 'bases'));

        // Filter by TH
        if (selectedTH !== 'All') {
            q = query(q, where('category', '==', selectedTH));
        }

        // Sort
        if (selectedTag === 'oldest') {
            q = query(q, orderBy('createdAt', 'asc'));
        } else {
            q = query(q, orderBy('createdAt', 'desc'));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
            let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

            // Client-side filtering untuk tags yang kompleks
            if (selectedTag !== 'All' && selectedTag !== 'latest' && selectedTag !== 'oldest') {
                if (selectedTag === 'top') {
                    data = data.sort((a, b) => (b.views || 0) - (a.views || 0));
                } else {
                    // Filter by tag (general, fun)
                    data = data.filter(base =>
                        Array.isArray(base.tags) && base.tags.includes(selectedTag === 'general' ? 'umum' : selectedTag)
                    );
                }
            }

            setBases(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [selectedTH, selectedTag]);

    const toggleBookmark = (id) => {
        const newBookmarks = bookmarks.includes(id)
            ? bookmarks.filter(b => b !== id)
            : [...bookmarks, id];
        setBookmarks(newBookmarks);
        localStorage.setItem('pendragon_bookmarks', JSON.stringify(newBookmarks));
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc'
            }}>
                <i className="ri-loader-4-line ri-spin" style={{ fontSize: '48px', color: '#0F2854' }}></i>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
            <Navbar selectedTH={selectedTH} onSelectTH={setSelectedTH} />
            <FilterTags selectedTag={selectedTag} onSelectTag={setSelectedTag} />

            {bases.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '80px 20px',
                    color: '#0F2854'
                }}>
                    <i className="ri-search-line" style={{ fontSize: '64px', marginBottom: '16px', display: 'block', color: '#4988C4' }}></i>
                    <h2 style={{ fontSize: '20px', marginBottom: '8px' }}>Tidak ada base ditemukan</h2>
                    <p style={{ color: '#4988C4' }}>Coba ganti filter atau upload base pertama!</p>
                </div>
            ) : (
                <BaseGrid
                    bases={bases}
                    bookmarks={bookmarks}
                    onToggleBookmark={toggleBookmark}
                />
            )}
        </div>
    );
}