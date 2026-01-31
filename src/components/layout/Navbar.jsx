// src/components/layout/Navbar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

const TOWN_HALLS = [
    { level: 'All', image: null },
    { level: 'TH17', image: '/img/town-hall-17.png' },
    { level: 'TH16', image: '/img/town-hall-16.png' },
    { level: 'TH15', image: '/img/town-hall-15.png' },
    { level: 'TH14', image: '/img/town-hall-14.png' },
    { level: 'TH13', image: '/img/town-hall-13.png' },
    { level: 'TH12', image: '/img/town-hall-12.png' },
    { level: 'TH11', image: '/img/town-hall-11.png' },
    { level: 'TH10', image: '/img/town-hall-10.png' },
    { level: 'TH9', image: '/img/town-hall-9.png' },
];

export default function Navbar({ selectedTH, onSelectTH }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (th) => {
        onSelectTH(th);
        setIsOpen(false);
    };

    const selectedData = TOWN_HALLS.find(th => th.level === selectedTH) || TOWN_HALLS[0];

    return (
        <nav style={{
            backgroundColor: '#0F2854',
            padding: '16px 20px',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: '0 2px 10px rgba(15, 40, 84, 0.3)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                {/* Logo */}
                <h1 style={{
                    fontSize: '24px',
                    fontWeight: '800',
                    color: '#BDE8F5',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer'
                }} onClick={() => navigate('/')}>
                    <i className="ri-sword-fill" style={{ color: '#4988C4' }}></i>
                    PENDRAGON
                </h1>

                {/* Dropdown Filter TH */}
                <div style={{ position: 'relative' }} ref={dropdownRef}>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            backgroundColor: '#1C4D8D',
                            border: '2px solid #4988C4',
                            borderRadius: '12px',
                            padding: '8px 16px',
                            cursor: 'pointer',
                            color: 'white',
                            fontWeight: '600',
                            fontSize: '14px',
                            transition: 'all 0.2s'
                        }}
                    >
                        {selectedData.image ? (
                            <img
                                src={selectedData.image}
                                alt={selectedTH}
                                style={{ width: '28px', height: '28px', objectFit: 'contain' }}
                            />
                        ) : (
                            <i className="ri-filter-3-line" style={{ fontSize: '20px' }}></i>
                        )}
                        <span>{selectedTH === 'All' ? 'Filter TH' : selectedTH}</span>
                        <i
                            className={isOpen ? 'ri-arrow-up-s-line' : 'ri-arrow-down-s-line'}
                            style={{ fontSize: '18px' }}
                        ></i>
                    </button>

                    {isOpen && (
                        <div style={{
                            position: 'absolute',
                            right: 0,
                            top: 'calc(100% + 8px)',
                            backgroundColor: 'white',
                            borderRadius: '16px',
                            boxShadow: '0 10px 40px rgba(15, 40, 84, 0.2)',
                            border: '1px solid #BDE8F5',
                            width: '220px',
                            maxHeight: '400px',
                            overflowY: 'auto',
                            zIndex: 1000
                        }}>
                            {TOWN_HALLS.map((th) => (
                                <button
                                    key={th.level}
                                    onClick={() => handleSelect(th.level)}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '12px 16px',
                                        border: 'none',
                                        borderBottom: '1px solid #f3f4f6',
                                        backgroundColor: selectedTH === th.level ? '#BDE8F5' : 'white',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        textAlign: 'left'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (selectedTH !== th.level) e.currentTarget.style.backgroundColor = '#f8fafc';
                                    }}
                                    onMouseLeave={(e) => {
                                        if (selectedTH !== th.level) e.currentTarget.style.backgroundColor = 'white';
                                    }}
                                >
                                    {th.image ? (
                                        <img
                                            src={th.image}
                                            alt={th.level}
                                            style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            backgroundColor: '#0F2854',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            fontSize: '12px'
                                        }}>
                                            All
                                        </div>
                                    )}
                                    <span style={{
                                        fontWeight: selectedTH === th.level ? '700' : '500',
                                        color: '#0F2854',
                                        fontSize: '15px'
                                    }}>
                                        {th.level}
                                    </span>
                                    {selectedTH === th.level && (
                                        <i className="ri-check-line" style={{ marginLeft: 'auto', color: '#0F2854' }}></i>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}