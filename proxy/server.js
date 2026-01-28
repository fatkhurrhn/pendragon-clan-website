const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const app = express();
const PORT = process.env.PROXY_PORT || 3002;

// CORS config
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

const CLAN_TAG = '#2Y29VCP89';
const COC_API_KEY = process.env.REACT_APP_COC_API_KEY;

if (!COC_API_KEY) {
  console.error('❌ Error: REACT_APP_COC_API_KEY tidak ditemukan di .env.local');
  process.exit(1);
}

// Helper function for API calls
async function fetchCoC(endpoint) {
  const url = `https://api.clashofclans.com/v1/${endpoint}`;
  const response = await axios.get(url, {
    headers: {
      'Authorization': `Bearer ${COC_API_KEY}`,
      'Accept': 'application/json'
    },
    timeout: 10000
  });
  return response.data;
}

// Routes
app.get('/api/clan', async (req, res) => {
  try {
    const data = await fetchCoC(`clans/${encodeURIComponent(CLAN_TAG)}`);
    res.json({ success: true, data, source: 'proxy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
  }
});

app.get('/api/members', async (req, res) => {
  try {
    const data = await fetchCoC(`clans/${encodeURIComponent(CLAN_TAG)}/members`);
    res.json({ success: true, data, source: 'proxy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
  }
});

app.get('/api/warlog', async (req, res) => {
  try {
    const data = await fetchCoC(`clans/${encodeURIComponent(CLAN_TAG)}/warlog`);
    res.json({ success: true, data, source: 'proxy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
  }
});

app.get('/api/currentwar', async (req, res) => {
  try {
    const data = await fetchCoC(`clans/${encodeURIComponent(CLAN_TAG)}/currentwar`);
    res.json({ success: true, data, source: 'proxy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(500).json({ success: false, error: error.response?.data?.message || error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({ 
    status: '✅ ONLINE', 
    service: 'Pendragon Proxy',
    port: PORT,
    env: 'development',
    time: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║     🚀 PENDRAGON PROXY SERVER         ║
║     📍 http://localhost:${PORT}          ║
╚════════════════════════════════════════╝

Endpoints:
• Health:    http://localhost:${PORT}/health
• Clan:      http://localhost:${PORT}/api/clan
• Members:   http://localhost:${PORT}/api/members  
• War Log:   http://localhost:${PORT}/api/warlog
• Current:   http://localhost:${PORT}/api/currentwar

Ready for React development! 🎮
`);
});