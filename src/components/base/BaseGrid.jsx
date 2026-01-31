// src/components/base/BaseGrid.jsx
import React from 'react';
import BaseCard from './BaseCard';

export default function BaseGrid({ bases, bookmarks, onToggleBookmark }) {
    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '24px 20px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: '24px',
            '@media (max-width: 640px)': {
                gridTemplateColumns: '1fr',
                padding: '16px'
            }
        }}>
            {bases.map(base => (
                <BaseCard
                    key={base.id}
                    base={base}
                    isBookmarked={bookmarks.includes(base.id)}
                    onToggleBookmark={onToggleBookmark}
                />
            ))}
        </div>
    );
}