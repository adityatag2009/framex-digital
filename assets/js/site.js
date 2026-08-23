(() => {
  const current = location.pathname.replace(/\/$/, '') || '/';
  const nav = document.querySelector('[data-site-nav]');
  const footer = document.querySelector('[data-site-footer]');
  const links = [
    ['/', 'Home'], ['/services', 'Services'], ['/portfolio', 'Portfolio'], ['/contact', 'Contact']
  ];
  if (nav) {
    nav.innerHTML = `<header class="topbar"><div class="wrap nav">
      <a class="brand" href="/"><i>FRAMEX</i> DIGITAL</a>
      <nav class="navlinks">${links.map(([href,label]) => `<a class="${current === href ? 'active' : ''}" href="${href}">${label}</a>`).join('')}</nav>
      <div class="navcta"><a class="btn btn-primary" data-wa="1">Start a project</a></div>
      <button class="mobile" aria-label="Open navigation" data-menu>☰</button>
    </div></header>`;
    nav.querySelector('[data-menu]')?.addEventListener('click', () => {
      const existing = nav.querySelector('.mobile-menu');
      if (existing) return existing.remove();
      const menu = document.createElement('div'); menu.className='mobile-menu';
      menu.style.cssText='position:absolute;left:4%;right:4%;top:66px;padding:14px;background:#0d0e15;border:1px solid rgba(255,255,255,.09);border-radius:16px;display:grid;gap:8px;z-index:60;box-shadow:0 18px 40px rgba(0,0,0,.35)';
      menu.innerHTML = `${links.map(([href,label]) => `<a href="${href}" style="padding:10px 12px;border-radius:10px;color:#e9ecf4">${label}</a>`).join('')}<a data-wa="1" class="btn btn-primary">WhatsApp</a>`;
      nav.firstElementChild.appendChild(menu);
      bindWhatsApp(menu);
    });
  }
  if (footer) footer.innerHTML = `<footer class="footer"><div class="wrap footer-row"><div><div class="footer-brand">FRAMEX DIGITAL</div><div class="note">Websites • Event films • Digital experiences</div></div><div class="note">© ${new Date().getFullYear()} FRAMEX DIGITAL</div></div></footer>`;
  function bindWhatsApp(root=document){ root.querySelectorAll?.('[data-wa]').forEach(el => el.addEventListener('click', e => { if (el.tagName==='A' && el.getAttribute('href')) return; e.preventDefault(); window.open('https://wa.me/8801682825667?text='+encodeURIComponent('Hello FRAMEX DIGITAL, I want to discuss a project.'),'_blank','noopener'); })); }
  bindWhatsApp();
})();
