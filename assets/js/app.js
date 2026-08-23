(() => {
  const defaults = {
    brand:{name:'FRAMEX DIGITAL',tagline:'Websites, event films and digital work made to get noticed.'},
    contact:{whatsapp1:'8801682825667',whatsapp2:'8801897882052',email:'hello@framexdigital.com'},
    pricing:{starter:{usd:'9',bdt:'900'},business:{usd:'18',bdt:'1800'},combo:{usd:'25',bdt:'2500'},event:{usd:'80',bdt:'8000'}},
    portfolio:[
      {type:'youtube',title:'Two souls. One forever. ✨',subtitle:'Event highlight • YouTube',url:'https://www.youtube.com/embed/OkV1-Xjq5OA',source:'https://www.youtube.com/watch?v=OkV1-Xjq5OA'},
      {type:'instagram',title:'Wedding reel',subtitle:'Instagram Reel • @dhrubo_0749',url:'https://www.instagram.com/reel/DVvcuZ_E-3n/',source:'https://www.instagram.com/reel/DVvcuZ_E-3n/'}
    ]
  };

  let config = defaults;
  let activeModalItem = null;

  const esc = (value='') => String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));

  const normaliseYouTube = (value='') => {
    const s = String(value).trim();
    if (!s) return '';
    if (/youtube\.com\/embed\//i.test(s)) return s;
    const id = (s.match(/[?&]v=([A-Za-z0-9_-]{6,})/i)||[])[1] || (s.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/i)||[])[1];
    return id ? `https://www.youtube.com/embed/${id}` : '';
  };
  const youtubeSource = (embed) => {
    const id = (String(embed).match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i)||[])[1];
    return id ? `https://www.youtube.com/watch?v=${id}` : embed;
  };
  const youtubeThumb = (embed) => {
    const id = (String(embed).match(/youtube\.com\/embed\/([A-Za-z0-9_-]{6,})/i)||[])[1];
    return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
  };
  const normaliseInstagram = (value='') => {
    const s = String(value).trim();
    if (!s) return '';
    const m = s.match(/instagram\.com\/(reel|p)\/([^/?#]+)/i);
    return m ? `https://www.instagram.com/${m[1].toLowerCase()}/${m[2]}/` : '';
  };
  const instagramEmbed = (url='') => {
    const m = String(url).match(/instagram\.com\/(reel|p)\/([^/?#]+)/i);
    return m ? `https://www.instagram.com/${m[1].toLowerCase()}/${m[2]}/embed` : '';
  };

  const applyBase = () => {
    document.querySelectorAll('[data-brand]').forEach(e => e.textContent = config.brand.name);
    document.querySelectorAll('[data-tagline]').forEach(e => e.textContent = config.brand.tagline);
    const p = config.pricing || {};
    Object.entries(p).forEach(([key,v]) => {
      document.querySelectorAll(`[data-usd="${key}"]`).forEach(e=>e.textContent=v.usd);
      document.querySelectorAll(`[data-bdt="${key}"]`).forEach(e=>e.textContent=v.bdt);
    });
    document.querySelectorAll('[data-wa]').forEach(el => {
      const number = el.dataset.wa === '2' ? config.contact.whatsapp2 : config.contact.whatsapp1;
      const href=`https://wa.me/${number}?text=${encodeURIComponent('Hello FRAMEX DIGITAL, I want to discuss a project.')}`;
      if (el.tagName==='A') el.href=href;
      else el.onclick=()=>window.open(href,'_blank','noopener');
    });
    const email = document.querySelector('[data-email]');
    if(email){ email.textContent=config.contact.email; email.href=`mailto:${config.contact.email}`; }
  };

  const renderPortfolio = () => {
    const grid = document.querySelector('[data-portfolio-grid]');
    const empty = document.querySelector('[data-portfolio-empty]');
    if (!grid) return;

    const items = Array.isArray(config.portfolio) ? config.portfolio.filter(Boolean) : [];
    grid.innerHTML = '';
    if (!items.length) { if (empty) empty.hidden = false; return; }
    if (empty) empty.hidden = true;

    items.forEach((raw, index) => {
      const type = String(raw.type || '').toLowerCase();
      const url = type === 'youtube' ? normaliseYouTube(raw.url || raw.embed) : normaliseInstagram(raw.url || raw.embed);
      if (!url) return;
      const source = raw.source || (type === 'youtube' ? youtubeSource(url) : url);
      const title = raw.title || (type === 'youtube' ? 'Event highlight' : 'Instagram Reel');
      const subtitle = raw.subtitle || (type === 'youtube' ? 'YouTube video' : 'Instagram Reel');
      const thumb = raw.image || (type === 'youtube' ? youtubeThumb(url) : '');
      const card = document.createElement('article');
      card.className = `project-card reveal`;
      card.tabIndex = 0;
      card.setAttribute('role','button');
      card.setAttribute('aria-label',`Play ${title}`);
      card.dataset.index = String(index);
      card.innerHTML = `
        <div class="project-art ${thumb ? '' : `project-gradient ${type === 'instagram' ? 'instagram' : ''}`}" ${thumb ? `style="background-image:url('${esc(thumb)}')"` : ''}></div>
        <div class="project-center"><div class="play-orbit"><span class="play-icon"></span></div></div>
        <div class="project-meta">
          <div class="project-meta-copy"><strong>${esc(title)}</strong><span>${esc(subtitle)}</span></div>
          <div class="project-arrow">↗</div>
        </div>`;
      card.addEventListener('click',()=>openModal({...raw,type,url,source,title,subtitle}));
      card.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){e.preventDefault();card.click();} });
      grid.appendChild(card);
    });
    reveal();
  };

  const modal = () => document.querySelector('[data-media-modal]');
  const closeModal = () => {
    const root = modal(); if (!root) return;
    root.classList.remove('open');
    root.setAttribute('aria-hidden','true');
    const player = root.querySelector('[data-modal-player]');
    if (player) player.innerHTML = '';
    activeModalItem = null;
    document.body.classList.remove('modal-open');
  };
  const openModal = item => {
    const root = modal(); if (!root) return;
    activeModalItem = item;
    const type = item.type === 'instagram' ? 'INSTAGRAM REEL' : 'YOUTUBE VIDEO';
    root.querySelector('[data-modal-type]').textContent = type;
    root.querySelector('[data-modal-title]').textContent = item.title;
    root.querySelector('[data-modal-source]').href = item.source;
    root.querySelector('[data-modal-note]').textContent = item.type === 'instagram' ? 'Official Instagram embed loaded from the real Reel.' : 'Real YouTube embed loaded from the supplied video.';
    const player = root.querySelector('[data-modal-player]');
    const src = item.type === 'instagram' ? instagramEmbed(item.url) : item.url;
    const allow = item.type === 'instagram' ? 'autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share' : 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    player.innerHTML = `<iframe src="${esc(src)}" title="${esc(item.title)}" loading="eager" allow="${allow}" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`;
    root.classList.add('open');
    root.setAttribute('aria-hidden','false');
    document.body.classList.add('modal-open');
    setTimeout(()=>root.querySelector('.modal-close')?.focus(),20);
  };

  const setupModal = () => {
    document.querySelectorAll('[data-modal-close]').forEach(el=>el.addEventListener('click',closeModal));
    document.addEventListener('keydown',e=>{if(e.key==='Escape' && modal()?.classList.contains('open')) closeModal();});
  };

  const setupForm = () => {
    const form=document.querySelector('[data-book-form]'); if(!form) return;
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const fd=new FormData(form), name=String(fd.get('name')||'').trim(), service=String(fd.get('service')||'').trim(), msg=String(fd.get('message')||'').trim();
      if(!name||!service){ document.querySelector('[data-status]').textContent='Please enter your name and select a service.'; return; }
      const text=`Hello FRAMEX DIGITAL!\nName: ${name}\nService: ${service}\nMessage: ${msg}`;
      window.open(`https://wa.me/${config.contact.whatsapp1}?text=${encodeURIComponent(text)}`,'_blank','noopener');
      document.querySelector('[data-status]').textContent='WhatsApp opened with your project brief.';
    });
  };

  const reveal=()=>{ const els=document.querySelectorAll('.reveal'); if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('show'));return;} const io=new IntersectionObserver(entries=>entries.forEach(x=>x.isIntersecting&&x.target.classList.add('show')),{threshold:.08}); els.forEach(e=>{ if(!e.classList.contains('show')) io.observe(e); }); };

  const mergeConfig = remote => {
    const merged = {
      ...defaults,
      ...remote,
      brand:{...defaults.brand,...(remote.brand||{})},
      contact:{...defaults.contact,...(remote.contact||{})},
      pricing:{...defaults.pricing,...(remote.pricing||{})},
      portfolio:Array.isArray(remote.portfolio) ? remote.portfolio : defaults.portfolio
    };
    merged.portfolio = merged.portfolio.map(item=>{
      const type=String(item.type||'').toLowerCase();
      const url=type==='youtube' ? normaliseYouTube(item.url||item.embed) : normaliseInstagram(item.url||item.embed);
      return {...item,type,url,source:item.source || (type==='youtube'?youtubeSource(url):url)};
    }).filter(item=>item.url);
    return merged;
  };

  const load=async()=>{
    try {
      const r=await fetch('/api/config',{cache:'no-store'});
      if(r.ok) config=mergeConfig(await r.json());
    } catch(_) {}
    applyBase();
    renderPortfolio();
    setupModal();
    setupForm();
    reveal();
  };

  document.addEventListener('DOMContentLoaded',load);
})();
