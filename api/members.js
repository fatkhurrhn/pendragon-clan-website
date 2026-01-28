// api/members.js - Clan members endpoint
const axios = require('axios');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const API_KEY = process.env.COC_API_KEY;
    const CLAN_TAG = process.env.CLAN_TAG || '2Y29VCP89';

    const response = await axios.get(
      `https://api.clashofclans.com/v1/clans/%23${CLAN_TAG}/members`,
      {
        headers: {
          'Authorization': `Bearer ${API_KEY}`
        }
      }
    );

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate');
    
    res.status(200).json({
      success: true,
      count: response.data.items?.length || 0,
      data: response.data,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Members API Error:', error.message);
    res.status(500).json({
      error: error.message,
      note: 'Failed to fetch clan members'
    });
  }
};