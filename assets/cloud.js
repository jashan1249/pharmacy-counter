/* Pharmacy Counter cloud client: Supabase auth + data over plain fetch (no library, works offline-first). */
(function () {
  const cfg = window.PC_CONFIG || {};
  const URL0 = (cfg.supabaseUrl || '').replace(/\/+$/, '');
  const KEY = cfg.supabaseAnonKey || '';
  const SKEY = 'pc_session';

  class CloudError extends Error {
    constructor(status, msg, code) { super(msg); this.status = status; this.code = code; }
  }

  const enabled = () => !!(URL0 && KEY);
  function session() { try { return JSON.parse(localStorage.getItem(SKEY) || 'null'); } catch (e) { return null; } }
  function setSession(s) {
    try {
      if (!s) { localStorage.removeItem(SKEY); return; }
      const keep = { access_token: s.access_token, refresh_token: s.refresh_token,
        expires_at: s.expires_at || Math.floor(Date.now() / 1000) + (s.expires_in || 3600), user: s.user };
      localStorage.setItem(SKEY, JSON.stringify(keep));
    } catch (e) {}
  }
  const user = () => (session() || {}).user || null;

  function friendly(status, body) {
    const m = String((body && (body.error_description || body.msg || body.message || body.error)) || '').toLowerCase();
    if (m.includes('invalid login')) return 'Email or password is wrong.';
    if (m.includes('email not confirmed')) return 'Please confirm your email first. Check your inbox (and spam) for the link.';
    if (m.includes('already registered') || m.includes('already been registered')) return 'An account with this email already exists. Log in instead.';
    if (m.includes('password should be') || m.includes('weak')) return 'Password must be at least 6 characters.';
    if (m.includes('rate limit') || status === 429) return 'Too many tries. Please wait a few minutes and try again.';
    if (m.includes('valid email') || m.includes('invalid format')) return 'Please enter a valid email address.';
    if (status === 0) return 'No internet connection. Please try again when you are online.';
    return (body && (body.error_description || body.msg || body.message)) || 'Something went wrong. Please try again.';
  }

  async function raw(method, path, { body, token, headers } = {}) {
    let res;
    try {
      res = await fetch(URL0 + path, {
        method,
        headers: Object.assign({ apikey: KEY, 'Content-Type': 'application/json',
          Authorization: 'Bearer ' + (token || KEY) }, headers || {}),
        body: body === undefined ? undefined : JSON.stringify(body)
      });
    } catch (e) { throw new CloudError(0, friendly(0)); }
    const txt = await res.text();
    let data = null; try { data = txt ? JSON.parse(txt) : null; } catch (e) { data = txt; }
    if (!res.ok) throw new CloudError(res.status, friendly(res.status, data), data && (data.code || data.error_code));
    return data;
  }

  let refreshing = null;
  async function refresh() {
    const s = session(); if (!s || !s.refresh_token) throw new CloudError(401, 'Please log in again.');
    if (!refreshing) refreshing = raw('POST', '/auth/v1/token?grant_type=refresh_token', { body: { refresh_token: s.refresh_token } })
      .then(d => { setSession(d); return d; })
      .catch(e => { if (e.status && e.status !== 0 && e.status < 500) setSession(null); throw e; })
      .finally(() => { refreshing = null; });
    return refreshing;
  }
  async function token() {
    const s = session(); if (!s) throw new CloudError(401, 'Please log in.');
    if ((s.expires_at || 0) - 60 < Date.now() / 1000) { const d = await refresh(); return d.access_token; }
    return s.access_token;
  }
  async function api(method, path, opts = {}) {
    try { return await raw(method, path, Object.assign({}, opts, { token: await token() })); }
    catch (e) {
      if (e.status === 401) { const d = await refresh(); return raw(method, path, Object.assign({}, opts, { token: d.access_token })); }
      throw e;
    }
  }

  const uid = () => { const u = user(); return u && u.id; };
  window.PCCloud = {
    enabled, session, user, uid, CloudError,
    async signUp(email, password, meta) {
      const d = await raw('POST', '/auth/v1/signup', { body: { email, password, data: meta || {} } });
      if (d && d.access_token) { setSession(d); return { session: true }; }
      return { session: false };
    },
    async signIn(email, password) {
      const d = await raw('POST', '/auth/v1/token?grant_type=password', { body: { email, password } });
      setSession(d); return d.user;
    },
    async signOut() { try { await raw('POST', '/auth/v1/logout', { token: (session() || {}).access_token }); } catch (e) {} setSession(null); },
    async recover(email, redirectTo) {
      await raw('POST', '/auth/v1/recover' + (redirectTo ? '?redirect_to=' + encodeURIComponent(redirectTo) : ''), { body: { email } });
    },
    takeSessionFromHash() {
      const h = new URLSearchParams(location.hash.slice(1));
      if (!h.get('access_token')) return null;
      const s = { access_token: h.get('access_token'), refresh_token: h.get('refresh_token'),
        expires_in: +h.get('expires_in') || 3600, user: null };
      return { s, type: h.get('type') };
    },
    async adoptSession(s) {
      const u = await raw('GET', '/auth/v1/user', { token: s.access_token });
      s.user = u; setSession(s); return u;
    },
    async updatePassword(password) { await api('PUT', '/auth/v1/user', { body: { password } }); },
    refresh,

    async getShopData() {
      const r = await api('GET', '/rest/v1/shop_data?select=data,updated_at&shop_id=eq.' + uid());
      return r && r[0] ? r[0] : null;
    },
    async getShopUpdated() {
      const r = await api('GET', '/rest/v1/shop_data?select=updated_at&shop_id=eq.' + uid());
      return r && r[0] ? r[0].updated_at : null;
    },
    async putShopData(data, device) {
      const r = await api('POST', '/rest/v1/shop_data?on_conflict=shop_id&select=updated_at', {
        body: { shop_id: uid(), data, updated_at: new Date().toISOString(), device: device || '' },
        headers: { Prefer: 'resolution=merge-duplicates,return=representation' }
      });
      return r && r[0] ? r[0].updated_at : new Date().toISOString();
    },
    async putBackup(day, data) {
      await api('POST', '/rest/v1/shop_backups?on_conflict=shop_id,day', {
        body: { shop_id: uid(), day, data }, headers: { Prefer: 'resolution=merge-duplicates,return=minimal' }
      });
    },
    async listBackups() { return api('GET', '/rest/v1/shop_backups?select=day,created_at&shop_id=eq.' + uid() + '&order=day.desc'); },
    async getBackup(day) {
      const r = await api('GET', '/rest/v1/shop_backups?select=data&shop_id=eq.' + uid() + '&day=eq.' + day);
      return r && r[0] ? r[0].data : null;
    },
    async getProfile() {
      const r = await api('GET', '/rest/v1/profiles?select=*&id=eq.' + uid());
      return r && r[0] ? r[0] : null;
    },
    async updateProfile(fields) {
      await api('PATCH', '/rest/v1/profiles?id=eq.' + uid(), { body: fields, headers: { Prefer: 'return=minimal' } });
    },
    async isAdmin() { return !!(await api('POST', '/rest/v1/rpc/is_admin', { body: {} })); },
    async listProfiles() { return api('GET', '/rest/v1/profiles?select=*&order=created_at.desc'); },
    async setPlan(id, plan) { await api('POST', '/rest/v1/rpc/set_plan', { body: { target: id, new_plan: plan } }); }
  };
})();
