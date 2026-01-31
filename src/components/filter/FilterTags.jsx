// src/components/filter/FilterTags.jsx
import React from 'react';

const TAGS = [
    { id: 'All', label: 'All', icon: 'ri-apps-line' },
    { id: 'top', label: 'Top', icon: 'ri-fire-line' },
    { id: 'general', label: 'General', icon: 'ri-shield-star-line' },
    { id: 'fun', label: 'Fun', icon: 'ri-emotion-laugh-line' },
    { id: 'latest', label: 'Latest', icon: 'ri-time-line' },
    { id: 'oldest', label: 'Oldest', icon: 'ri-history-line' },
];

export default function FilterTags({ selectedTag, onSelectTag }) {
    return (
        <div style={{
            backgroundColor: '#1C4D8D',
            padding: '16px 20px',
            borderTop: '1px solid rgba(255,255,255,0.1)'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                display: 'flex',
                gap: '10px',
                overflowX: 'auto',
                paddingBottom: '4px',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
            }}>
                {TAGS.map((tag) => (
                    <button
                        key={tag.id}
                        onClick={() => onSelectTag(tag.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '8px 16px',
                            borderRadius: '20px',
                            border: '2px solid',
                            borderColor: selectedTag === tag.id ? '#BDE8F5' : 'rgba(255,255,255,0.3)',
                            backgroundColor: selectedTag === tag.id ? '#BDE8F5' : 'transparent',
                            color: selectedTag === tag.id ? '#0F2854' : 'white',
                            fontSize: '13px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            transition: 'all 0.2s',
                            flexShrink: 0
                        }}
                    >
                        <i className={tag.icon}></i>
                        {tag.label}
                    </button>
                ))}
            </div>
        </div>
    );
}