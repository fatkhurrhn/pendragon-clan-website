import axios from 'axios';

const CLAN_TAG = '#2Y29VCP89';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  try {
    const response = await axios.get(
      `https://api.clashofclans.com/v1/clans/${encodeURIComponent(CLAN_TAG)}/currentwar`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_COC_API_KEY}`,
          'Accept': 'application/json'
        },
        timeout: 10000
      }
    );

    res.status(200).json({
      success: true,
      data: response.data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API CurrentWar Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message,
      timestamp: new Date().toISOString()
    });
  }
}