/* Shared header, footer and WhatsApp button for the website pages. */
(function () {
  const cfg = window.PC_CONFIG || {};
  const page = document.body.dataset.page || '';
  const loggedIn = !!(window.PCCloud && PCCloud.enabled() && PCCloud.session());
  const appCta = loggedIn ? '<a class="btn pri sm" href="app/">Open my app</a>'
    : (window.PCCloud && PCCloud.enabled() ? '<a class="btn pri sm" href="login.html#signup">Start free</a>' : '<a class="btn pri sm" href="app/">Open app</a>');
  const top = document.getElementById('top');
  if (top) top.innerHTML = `<div class="wrap">
    <a class="logo" href="./"><img src="assets/icon.svg" alt="">Pharmacy Counter <span class="beta">BETA</span></a>
    <nav class="links" aria-label="Main">
      <a href="./#features" class="hide-sm">Features</a>
      <a href="pricing.html" class="${page === 'pricing' ? 'cur' : ''}">Pricing</a>
      <a href="help.html" class="${page === 'help' ? 'cur' : ''}">Help</a>
      ${loggedIn ? '' : (window.PCCloud && PCCloud.enabled() ? '<a href="login.html">Log in</a>' : '')}
      ${appCta}
    </nav></div>`;
  const foot = document.getElementById('foot');
  if (foot) foot.innerHTML = `<div class="wrap">
    <span>© ${new Date().getFullYear()} Pharmacy Counter · Free billing for medical stores · Beta</span>
    <span class="row" style="gap:18px"><a href="pricing.html">Pricing</a><a href="help.html">Help</a><a href="help.html#privacy">Privacy</a>${cfg.supportEmail ? `<a href="mailto:${cfg.supportEmail}">${cfg.supportEmail}</a>` : ''}</span></div>`;
  if (cfg.whatsapp && page !== 'login' && page !== 'admin') {
    const a = document.createElement('a');
    a.className = 'wa'; a.target = '_blank'; a.rel = 'noopener';
    a.href = 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent('Hi, I want to know more about Pharmacy Counter.');
    a.textContent = 'WhatsApp us';
    document.body.appendChild(a);
  }
  document.querySelectorAll('[data-wa]').forEach(el => {
    if (cfg.whatsapp) el.href = 'https://wa.me/' + cfg.whatsapp + '?text=' + encodeURIComponent(el.dataset.wa);
    else if (cfg.supportEmail) el.href = 'mailto:' + cfg.supportEmail + '?subject=' + encodeURIComponent(el.dataset.wa);
    else if (el.getAttribute('href') === '#') el.hidden = true;
  });
  document.querySelectorAll('[data-start]').forEach(el => {
    el.href = loggedIn ? 'app/' : (window.PCCloud && PCCloud.enabled() ? 'login.html#signup' : 'app/');
  });
})();
