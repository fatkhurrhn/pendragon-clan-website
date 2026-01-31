// src/utils/timeFormat.js

/**
 * Format timestamp Firebase menjadi relative time (2m, 1h, 3d, dst)
 * @param {Timestamp|Date} timestamp - Firebase timestamp atau Date object
 * @returns {string} - Formatted time (misal: "2m", "1h", "3d")
 */
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '';
  
  const now = new Date();
  // Firebase timestamp punya method toDate(), JS Date tidak
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  // Kurang dari 1 menit
  if (diffInSeconds < 60) {
    return `${diffInSeconds}s`;
  }
  
  // Kurang dari 1 jam
  if (diffInSeconds < 3600) {
    return `${Math.floor(diffInSeconds / 60)}m`;
  }
  
  // Kurang dari 24 jam
  if (diffInSeconds < 86400) {
    return `${Math.floor(diffInSeconds / 3600)}h`;
  }
  
  // Kurang dari 7 hari
  if (diffInSeconds < 604800) {
    return `${Math.floor(diffInSeconds / 86400)}d`;
  }
  
  // Lebih dari 1 minggu, tampilkan tanggal singkat
  return `${Math.floor(diffInSeconds / 604800)}w`;
};

/**
 * Format timestamp menjadi tanggal lengkap (untuk tooltip/detail)
 * @param {Timestamp|Date} timestamp 
 * @returns {string} - Format: "31 Jan 2024, 14:30"
 */
export const formatFullDate = (timestamp) => {
  if (!timestamp) return '';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};