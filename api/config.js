module.exports = (req, res) => {
  const text = (key, fallback = '') => String(process.env[key] ?? fallback).trim();
  const cleanYouTube = (value) => {
    const s = text(value);
    if (!s) return '';
    if (/^https:\/\/www\.youtube\.com\/embed\//i.test(s)) return s;
    const match = s.match(/(?:v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/i);
    return match ? `https://www.youtube.com/embed/${match[1]}` : '';
  };
  const cleanInstagram = (value) => {
    const s = text(value);
    if (!s) return '';
    const m = s.match(/instagram\.com\/(?:reel|p)\/([^/?#]+)/i);
    return m ? `https://www.instagram.com/${s.toLowerCase().includes('/reel/') ? 'reel' : 'p'}/${m[1]}` : s.replace(/\/$/, '');
  };
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  res.status(200).json({
    brand: {
      name: text('BRAND_NAME', 'FRAMEX DIGITAL'),
      tagline: text('BRAND_TAGLINE', 'Websites, event films and digital work made to get noticed.')
    },
    contact: {
      whatsapp1: text('WHATSAPP_1', '8801682825667'),
      whatsapp2: text('WHATSAPP_2', '8801897882052'),
      email: text('EMAIL', 'hello@framexdigital.com'),
      instagram: text('INSTAGRAM', 'https://www.instagram.com/'),
      facebook: text('FACEBOOK', 'https://www.facebook.com/'),
      youtube: text('YOUTUBE', 'https://www.youtube.com/')
    },
    pricing: {
      starter: { usd: text('STARTER_PRICE_USD', '9'), bdt: text('STARTER_PRICE_BDT', '900') },
      business: { usd: text('BUSINESS_PRICE_USD', '18'), bdt: text('BUSINESS_PRICE_BDT', '1800') },
      combo: { usd: text('COMBO_PRICE_USD', '25'), bdt: text('COMBO_PRICE_BDT', '2500') },
      event: { usd: text('EVENT_PRICE_USD', '80'), bdt: text('EVENT_PRICE_BDT', '8000') }
    },
    portfolio: {
      youtube: [cleanYouTube('YOUTUBE_EMBED_1')].filter(Boolean),
      instagram: [cleanInstagram('INSTAGRAM_REEL_1')].filter(Boolean)
    }
  });
};
