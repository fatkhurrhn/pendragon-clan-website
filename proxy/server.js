// proxy/server.js - Local development proxy
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json());

// Load API Key from .env.local
const API_KEY = process.env.REACT_APP_COC_API_KEY || 'your-api-key-here';

// Endpoints that match Vercel production
app.get('/api/clan', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.clashofclans.com/v1/clans/%232Y29VCP89',
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );
    
    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString(),
      source: 'LOCAL PROXY'
    });
    
  } catch (error) {
    console.error('Local Proxy Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/members', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.clashofclans.com/v1/clans/%232Y29VCP89/members',
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );
    
    res.json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/health', (req, res) => {
  res.json({
    status: '🟢 ONLINE',
    service: 'Pendragon Local Proxy',
    port: PORT,
    environment: 'development',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════╗
║     🚀 LOCAL PROXY SERVER       ║
║     📍 http://localhost:${PORT}    ║
╚══════════════════════════════════╝

✅ Health: http://localhost:${PORT}/health
✅ Clan Data: http://localhost:${PORT}/api/clan
✅ Members: http://localhost:${PORT}/api/members

🎮 Ready for React development!
  `);
});