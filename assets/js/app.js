(() => {
  const defaults = {
    brand:{name:'FRAMEX DIGITAL',tagline:'Websites, event films and digital work made to get noticed.'},
    contact:{whatsapp1:'8801682825667',whatsapp2:'8801897882052',email:'hello@framexdigital.com'},
    pricing:{starter:{usd:'9',bdt:'900'},business:{usd:'18',bdt:'1800'},combo:{usd:'25',bdt:'2500'},event:{usd:'80',bdt:'8000'}},
    portfolio:{youtube:['https://www.youtube.com/embed/OkV1-Xjq5OA'],instagram:['https://www.instagram.com/reel/DVvcuZ_E-3n/']}
  };
  let config = defaults;
  const render = () => {
    document.querySelectorAll('[data-brand]').forEach(e => e.textContent = config.brand.name);
    document.querySelectorAll('[data-tagline]').forEach(e => e.textContent = config.brand.tagline);
    const p=config.pricing;
    Object.entries(p).forEach(([key,v]) => {
      document.querySelectorAll(`[data-usd="${key}"]`).forEach(e=>e.textContent=v.usd);
      document.querySelectorAll(`[data-bdt="${key}"]`).forEach(e=>e.textContent=v.bdt);
    });
    document.querySelectorAll('[data-wa]').forEach(el => {
      if (el.dataset.waBound==='1') return;
      const number = el.dataset.wa === '2' ? config.contact.whatsapp2 : config.contact.whatsapp1;
      const href=`https://wa.me/${number}?text=${encodeURIComponent('Hello FRAMEX DIGITAL, I want to discuss a project.')}`;
      if (el.tagName==='A') el.href=href;
      else el.addEventListener('click',()=>window.open(href,'_blank','noopener'));
      el.dataset.waBound='1';
    });
    renderYoutube(); renderInstagram();
    const email = document.querySelector('[data-email]'); if(email){ email.textContent=config.contact.email; email.href=`mailto:${config.contact.email}`; }
  };
  const renderYoutube = () => {
    document.querySelectorAll('[data-youtube]').forEach(box => {
      if(box.dataset.ready==='1') return;
      const src=(config.portfolio.youtube||[])[0]; if(!src) return;
      box.innerHTML = `<div class="media-head"><strong>Event Highlight</strong><span>YouTube • live embed</span></div><iframe class="video-frame" src="${src}" title="FRAMEX DIGITAL — Event Highlight" loading="eager" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe><div style="padding:12px 16px;background:#08080d;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;gap:10px;align-items:center"><span class="note">Video is embedded directly on this page.</span><a class="btn btn-soft" href="${src}" target="_blank" rel="noopener">Open video</a></div>`;
      box.dataset.ready='1';
    });
  };
  const renderInstagram = () => {
    document.querySelectorAll('[data-instagram]').forEach(box => {
      if(box.dataset.ready==='1') return;
      const src=(config.portfolio.instagram||[])[0]; if(!src) return;
      const m=src.match(/instagram\.com\/(reel|p)\/([^/?#]+)/i); if(!m) return;
      const embed=`https://www.instagram.com/${m[1]}/${m[2]}/embed`;
      box.innerHTML=`<div class="media-head"><strong>Instagram Reel</strong><span>Instagram • direct embed</span></div><div class="ig-wrap"><iframe class="ig-frame" src="${embed}" title="FRAMEX DIGITAL Instagram Reel" loading="eager" allowfullscreen></iframe></div><div style="padding:12px 16px;background:#fff;border-top:1px solid #eee;display:flex;justify-content:space-between;gap:10px;align-items:center"><span style="font:12px/1.4 Inter,system-ui;color:#777">Official Instagram embed.</span><a class="btn" style="background:#111;color:#fff;border:0" href="${src}" target="_blank" rel="noopener">Open on Instagram</a></div>`;
      box.dataset.ready='1';
    });
  };
  const setupForm = () => {
    const form=document.querySelector('[data-book-form]'); if(!form) return;
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const fd=new FormData(form), name=String(fd.get('name')||'').trim(), service=String(fd.get('service')||'').trim(), msg=String(fd.get('message')||'').trim();
      if(!name||!service){ document.querySelector('[data-status]').textContent='Please enter your name and select a service.'; return; }
      const text=`Hello FRAMEX DIGITAL!%0AName: ${encodeURIComponent(name)}%0AService: ${encodeURIComponent(service)}%0AMessage: ${encodeURIComponent(msg)}`;
      window.open(`https://wa.me/${config.contact.whatsapp1}?text=${text}`,'_blank','noopener');
      document.querySelector('[data-status]').textContent='WhatsApp opened with your project brief.';
    });
  };
  const reveal=()=>{ const els=document.querySelectorAll('.reveal'); if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('show'));return;} const io=new IntersectionObserver(entries=>entries.forEach(x=>x.isIntersecting&&x.target.classList.add('show')),{threshold:.08}); els.forEach(e=>io.observe(e)); };
  const load=async()=>{ try { const r=await fetch('/api/config',{cache:'no-store'}); if(r.ok){ const remote=await r.json(); config=Object.assign({},defaults,remote,{brand:{...defaults.brand,...remote.brand},contact:{...defaults.contact,...remote.contact},pricing:{...defaults.pricing,...remote.pricing},portfolio:{...defaults.portfolio,...remote.portfolio}}); } } catch(_) {} render(); setupForm(); reveal(); };
  document.addEventListener('DOMContentLoaded',load);
})();
