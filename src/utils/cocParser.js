// src/utils/cocParser.js

/**
 * Ekstrak Town Hall level dari link Clash of Clans
 * Pattern: link.clashofclans.com/id?action=OpenLayout&id=TH16%3A...
 * @param {string} link - URL layout COC
 * @returns {string|null} - "TH16", "TH15", dll atau null jika tidak terdeteksi
 */
export const extractTownHall = (link) => {
  if (!link || typeof link !== 'string') return null;
  
  // Pattern 1: Format standar link.clashofclans.com dengan id=TH16%3A
  const standardMatch = link.match(/[?&]id=TH(\d+)%3A/i);
  if (standardMatch) {
    return `TH${standardMatch[1]}`;
  }
  
  // Pattern 2: Format dengan TH diikuti angka (backup)
  const backupMatch = link.match(/TH(\d{1,2})/i);
  if (backupMatch) {
    return `TH${backupMatch[1]}`;
  }
  
  // Pattern 3: Cari angka setelah Town Hall (untuk variasi format)
  const genericMatch = link.match(/town\s*hall\s*(\d{1,2})/i);
  if (genericMatch) {
    return `TH${genericMatch[1]}`;
  }
  
  return null;
};

/**
 * Validasi apakah link adalah valid COC layout link
 * @param {string} link 
 * @returns {boolean}
 */
export const isValidCOCLink = (link) => {
  if (!link) return false;
  
  // Harus mengandung link.clashofclans.com atau pattern TH
  return link.includes('link.clashofclans.com') || 
         /TH\d{1,2}/i.test(link);
};