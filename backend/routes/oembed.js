const express = require('express');
const router = express.Router();
const https = require('https');

const fetchOEmbed = (url, platform) => {
  return new Promise((resolve, reject) => {
    let apiUrl = '';
    if (platform === 'youtube') {
      apiUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
    } else if (platform === 'twitter') {
      apiUrl = `https://publish.twitter.com/oembed?url=${encodeURIComponent(url)}`;
    } else {
      return reject('Unsupported platform');
    }

    https.get(apiUrl, (resp) => {
      let data = '';
      resp.on('data', chunk => data += chunk);
      resp.on('end', () => resolve(JSON.parse(data)));
    }).on('error', err => reject(err));
  });
};

router.get('/', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ msg: 'No URL provided' });

  let platform = '';
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    platform = 'youtube';
  } else if (url.includes('twitter.com')) {
    platform = 'twitter';
  } else {
    return res.status(400).json({ msg: 'Unsupported URL' });
  }

  try {
    const embed = await fetchOEmbed(url, platform);
    res.json(embed);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch embed', error: err.message });
  }
});

module.exports = router;