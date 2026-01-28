import axios from 'axios';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const { tag } = req.query;
  
  if (!tag) {
    return res.status(400).json({ success: false, error: 'Player tag is required' });
  }

  try {
    // Format tag dengan #
    const playerTag = tag.startsWith('#') ? tag : '#' + tag;
    
    const response = await axios.get(
      `https://api.clashofclans.com/v1/players/${encodeURIComponent(playerTag)}`,
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
    console.error('API Player Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data?.message || error.message,
      timestamp: new Date().toISOString()
    });
  }
}