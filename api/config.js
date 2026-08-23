module.exports = (req, res) => {
  const text = (key, fallback = '') => String(process.env[key] ?? fallback).trim();
  const cleanYouTube = value => {
    const s = text(value);
    if (!s) return '';
    if (/^https:\/\/www\.youtube\.com\/embed\/[A-Za-z0-9_-]+/i.test(s)) return s;
    const match = s.match(/(?:v=|youtu\.be\/|youtube\.com\/shorts\/)([A-Za-z0-9_-]{6,})/i);
    return match ? `https://www.youtube.com/embed/${match[1]}` : '';
  };
  const cleanInstagram = value => {
    const s = text(value);
    const m = s.match(/instagram\.com\/(reel|p)\/([^/?#]+)/i);
    return m ? `https://www.instagram.com/${m[1].toLowerCase()}/${m[2]}/` : '';
  };
  const portfolio = [];
  for (let i = 1; i <= 8; i++) {
    const yt = cleanYouTube(`YOUTUBE_EMBED_${i}`);
    const ig = cleanInstagram(`INSTAGRAM_REEL_${i}`);
    if (yt) portfolio.push({
      type:'youtube',
      title:text(`YOUTUBE_TITLE_${i}`, i === 1 ? 'Two souls. One forever. ✨' : 'YouTube project'),
      subtitle:text(`YOUTUBE_SUBTITLE_${i}`, 'Event highlight • YouTube'),
      url:yt,
      source:text(`YOUTUBE_SOURCE_${i}`, yt.replace('/embed/','/watch?v='))
    });
    if (ig) portfolio.push({
      type:'instagram',
      title:text(`INSTAGRAM_TITLE_${i}`, i === 1 ? 'Wedding reel' : 'Instagram Reel'),
      subtitle:text(`INSTAGRAM_SUBTITLE_${i}`, 'Instagram Reel'),
      url:ig,
      source:ig
    });
  }
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=300');
  res.status(200).json({
    brand:{name:text('BRAND_NAME','FRAMEX DIGITAL'),tagline:text('BRAND_TAGLINE','Websites, event films and digital work made to get noticed.')},
    contact:{whatsapp1:text('WHATSAPP_1','8801682825667'),whatsapp2:text('WHATSAPP_2','8801897882052'),email:text('EMAIL','hello@framexdigital.com'),instagram:text('INSTAGRAM','https://www.instagram.com/'),facebook:text('FACEBOOK','https://www.facebook.com/'),youtube:text('YOUTUBE','https://www.youtube.com/')},
    pricing:{
      starter:{usd:text('STARTER_PRICE_USD','9'),bdt:text('STARTER_PRICE_BDT','900')},
      business:{usd:text('BUSINESS_PRICE_USD','18'),bdt:text('BUSINESS_PRICE_BDT','1800')},
      combo:{usd:text('COMBO_PRICE_USD','25'),bdt:text('COMBO_PRICE_BDT','2500')},
      event:{usd:text('EVENT_PRICE_USD','80'),bdt:text('EVENT_PRICE_BDT','8000')}
    },
    portfolio
  });
};
