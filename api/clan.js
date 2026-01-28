// api/clan.js - Main clan data endpoint
const axios = require('axios');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const API_KEY = process.env.COC_API_KEY;
    const CLAN_TAG = process.env.CLAN_TAG || '2Y29VCP89';

    if (!API_KEY) {
      return res.status(500).json({
        error: 'API Key not configured',
        message: 'Please set COC_API_KEY environment variable in Vercel'
      });
    }

    console.log(`[API] Fetching clan data for: ${CLAN_TAG}`);

    const response = await axios.get(
      `https://api.clashofclans.com/v1/clans/%23${CLAN_TAG}`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Accept': 'application/json',
          'User-Agent': 'PendragonClanWebsite/1.0'
        },
        timeout: 10000 // 10 second timeout
      }
    );

    // Cache for 5 minutes on Vercel's edge
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    res.setHeader('Vercel-CDN-Cache-Control', 's-maxage=300');
    
    res.status(200).json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString(),
      source: 'Supercell API'
    });

  } catch (error) {
    console.error('API Error:', error.message);
    
    // Enhanced error handling
    if (error.response) {
      // Supercell API error
      res.status(error.response.status).json({
        error: 'Clash of Clans API Error',
        status: error.response.status,
        message: error.response.data?.message || 'Unknown API error',
        reason: error.response.data?.reason
      });
    } else if (error.request) {
      // Network error
      res.status(503).json({
        error: 'Network Error',
        message: 'Cannot connect to Clash of Clans API',
        suggestion: 'Check your network connection or try again later'
      });
    } else {
      // Server error
      res.status(500).json({
        error: 'Server Error',
        message: error.message
      });
    }
  }
};