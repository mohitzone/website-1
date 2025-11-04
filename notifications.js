// notifications.js
const apiKey = window.CONFIG?.YOUTUBE?.apiKey || '';
const channelId = window.CONFIG?.YOUTUBE?.channelId || '';

(function () {
  const CLOSED_KEY = 'notifClosedOn';

  const container = document.getElementById("notification-tab");

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignore time for comparison
  const todayKey = today.toISOString().slice(0,10);

  // ===== Handle window.events (structured events.js) =====
  const events = (window.events || []).map(e => {
    let parsedDate = e && e.date ? new Date(e.date) : null; // assumes ISO/valid format
    return {
      title: e.title || "",
      description: e.description || "",
      place: e.place || "",
      address: e.address || "",
      date: parsedDate,
      displayDate: e.displayDate || e.date || ''
    };
  }).filter(e => e.date instanceof Date && !isNaN(e.date));

  // ===== Handle window.calendar (structured calander.js) =====
  const calendarEvents = [];
  (window.calendar || []).forEach(month => {
    (month.events || []).forEach(ev => {
      if (typeof ev === 'object' && ev.day && month.month && month.year) {
        const monthsMap = {
          "जनवरी":0,"फ़रवरी":1,"फरवरी":1,"मार्च":2,"अप्रैल":3,"मई":4,"जून":5,
          "जुलाई":6,"अगस्त":7,"सितंबर":8,"सितम्बर":8,"अक्टूबर":9,"नवंबर":10,"नवम्बर":10,"दिसंबर":11,"दिसम्बर":11
        };
        const monthIndex = monthsMap[month.month];
        if (monthIndex !== undefined) {
          const parsedDate = new Date(month.year, monthIndex, ev.day);
          calendarEvents.push({
            title: ev.title || '',
            description: ev.description || '',
            place: ev.place || '',
            address: ev.address || '',
            date: parsedDate,
            displayDate: `${ev.day}${ev.weekday ? ' (' + ev.weekday + ')' : ''} ${month.month} ${month.year}`
          });
        }
      }
    });
  });

  // ===== Merge both sources =====
  // We'll keep this as a mutable list because we may prepend 'live' notifications
  let allEvents = [...events, ...calendarEvents]
    .filter(e => e.date >= today)   // only upcoming
    .sort((a, b) => a.date - b.date)
    .slice(0, 5); // take next 5

  // ===== Promo: show updated pravachan notification until 5 Nov 2025 (IST) =====
// ===== Add Today's Shlok as Top Notification =====
try {
  // Correct for IST (UTC +05:30)
const now = new Date();
const istOffsetMs = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
const istNow = new Date(now.getTime() + istOffsetMs);
const todayISO = istNow.toISOString().slice(0, 10);


  fetch('jaibaba_shilok/thoughts.json', { cache: 'no-store' })

    .then(r => r.json())
    .then(thoughts => {
      const todays = thoughts.find(t => t.date === todayISO);
      if (todays) {
        const shlokNotif = {
          title: 'आज का श्लोक: ' + (todays.title || ''),
          description: todays.text || '',
          date: new Date(todayISO),
          displayDate: todayISO
        };
        allEvents.unshift(shlokNotif);
      }
    })
    .catch(err => console.warn('Failed to fetch today shlok:', err));
} catch (e) {
  console.warn('Error adding today shlok notification:', e);
}

  try {
    // Compute current date in IST (Indian Standard Time = UTC+5:30)
    const nowLocal = new Date();
    const utcMs = nowLocal.getTime() + (nowLocal.getTimezoneOffset() * 60000);
    const istOffsetMs = 5.5 * 60 * 60 * 1000;
    const istNow = new Date(utcMs + istOffsetMs);
    const istY = istNow.getFullYear();
    const istM = istNow.getMonth();
    const istD = istNow.getDate();

    // Target date (inclusive) in IST: 5 Nov 2025 -> year=2025, monthIndex=10
    const targetY = 2025, targetM = 10, targetD = 5;

    const beforeOrEqual = (istY < targetY) || (istY === targetY && (istM < targetM || (istM === targetM && istD <= targetD)));
    if (beforeOrEqual) {
      const fname = 'कार्तिक महीने मै गुरूमहाराज जयबाबा जन जी अमृतमयी कथा.mp3';
  // Prefer an explicit AUDIO_BASE if provided (useful for production URLs)
  // Example: set in HTML before this script: window.AUDIO_BASE = 'https://www.nijdhamashram.in/Jaibaba_audios/';
      const audioBase = (typeof window !== 'undefined' && window.AUDIO_BASE) ? window.AUDIO_BASE : null;
      const origin = (typeof location !== 'undefined' && location && location.origin && location.origin !== 'null') ? location.origin : '';
      // For promo we want to redirect users to the Pravachan listing page (not directly to the MP3)
      // Prefer explicit AUDIO_PRAVACHAN_PAGE if provided, else use AUDIO_BASE + 'pravachan/' or origin path
      const audioPravachan = (typeof window !== 'undefined' && window.AUDIO_PRAVACHAN_PAGE) ? window.AUDIO_PRAVACHAN_PAGE : null;
      let href = null;
      if (audioPravachan) {
        href = audioPravachan;
      } else if (audioBase) {
        // ensure trailing slash
        href = (audioBase.endsWith('/') ? audioBase : (audioBase + '/')) + 'pravachan/';
      } else if (origin) {
        href = origin + '/Jaibaba_audios/pravachan/';
      } else {
        // fallback relative
        href = './Jaibaba_audios/pravachan/';
      }
      const promoEv = {
        title: 'नवीन: कार्तिक महीने में गुरूमहाराज जयबाबा जन जी अमृतमयी कथा अपडेट हुई',
        description: 'Kartik Mahotsav पर नया प्रवचन उपलब्ध — सुनें और डाउनलोड करें।',
        place: 'प्रवचन अपडेट',
        address: href,
        date: new Date(),
        // do not show a date in the UI for this promo; control expiry via promoExpiry (IST)
        displayDate: '',
        promoExpiry: '2025-11-05T23:59:59+05:30'
      };
      // Prepend promo so it appears first
      allEvents.unshift(promoEv);
      // trim to 5 items
      allEvents = allEvents.slice(0,5);
    }
  } catch (e) {
    // ignore any promo logic errors
    console.warn('Promo notification setup failed', e);
  }

  // Configuration for live-checking. Place your API keys / IDs here or set
  // them at runtime: window.LIVE_CHECK_CONFIG = { youtube: {...}, facebook: {...} }
  // Example:
  // window.LIVE_CHECK_CONFIG = {
  //   youtube: { apiKey: 'YOUR_GOOGLE_API_KEY', channelId: 'UCxxxx...' },
  //   facebook: { accessToken: 'PAGE_ACCESS_TOKEN', pageId: 'nijdham.gwalior' }
  // };
window.LIVE_CHECK_CONFIG = window.LIVE_CHECK_CONFIG || {};
window.LIVE_CHECK_CONFIG.youtube = window.LIVE_CHECK_CONFIG.youtube || {
  apiKey: window.CONFIG?.YOUTUBE?.apiKey,
  channelId: window.CONFIG?.YOUTUBE?.channelId
};


  // Helper: check YouTube live via Data API v3 (requires apiKey and channelId).
  async function checkYouTubeLive(cfg) {
    if (!cfg || !cfg.apiKey || !cfg.channelId) return null;
    try {
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(cfg.channelId)}&eventType=live&type=video&key=${encodeURIComponent(cfg.apiKey)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('YT fetch failed');
      const data = await res.json();
      if (data && Array.isArray(data.items) && data.items.length > 0) {
        const item = data.items[0];
        const videoId = (item.id && (item.id.videoId || item.id)) || null;
        const title = item.snippet && item.snippet.title ? item.snippet.title : 'Live on YouTube';
        return { platform: 'youtube', live: true, title, url: videoId ? `https://youtu.be/${videoId}` : `https://www.youtube.com/channel/${cfg.channelId}` };
      }
      return null;
    } catch (e) {
      // don't break on errors
      console.warn('YouTube live-check error', e);
      return null;
    }
  }

  // Helper: check Facebook live via Graph API (requires page access token and pageId).
  async function checkFacebookLive(cfg) {
    if (!cfg || !cfg.accessToken || !cfg.pageId) return null;
    try {
      // Try Graph API live_videos endpoint. Requires appropriate permissions on token.
      const url = `https://graph.facebook.com/${encodeURIComponent(cfg.pageId)}/live_videos?access_token=${encodeURIComponent(cfg.accessToken)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('FB fetch failed');
      const data = await res.json();
      if (data && Array.isArray(data.data) && data.data.length > 0) {
        // Look for any entry with status 'LIVE' or that looks current.
        const liveItem = data.data.find(d => d.status === 'LIVE') || data.data[0];
        const vid = liveItem && liveItem.id ? liveItem.id : null;
        const title = liveItem && liveItem.description ? liveItem.description : 'Live on Facebook';
        return { platform: 'facebook', live: true, title, url: vid ? `https://www.facebook.com/${cfg.pageId}/videos/${vid}` : `https://www.facebook.com/${cfg.pageId}/live` };
      }
      return null;
    } catch (e) {
      console.warn('Facebook live-check error', e);
      return null;
    }
  }

  // Run live checks in parallel; merge any live notifications to the top of allEvents
  async function detectLiveStreamsAndMerge() {
    const cfg = window.LIVE_CHECK_CONFIG || {};
    const checks = [];
    if (cfg.youtube && (cfg.youtube.apiKey && cfg.youtube.channelId)) checks.push(checkYouTubeLive(cfg.youtube));
    if (cfg.facebook && (cfg.facebook.accessToken && cfg.facebook.pageId)) checks.push(checkFacebookLive(cfg.facebook));

    if (checks.length === 0) return; // nothing configured

    try {
      const results = await Promise.all(checks.map(p => p.catch(() => null)));
      // for each positive result, create an event-like object and put it at front
      results.filter(Boolean).forEach(r => {
        if (r && r.live) {
          const liveEv = {
            title: `Nijdham ashram gwalior is live on ${r.platform === 'youtube' ? 'YouTube' : 'Facebook'}`,
            description: r.title || '',
            place: `${r.platform} live`,
            address: r.url,
            date: new Date(),
            displayDate: 'Live Now'
          };
          // prepend so it appears first
          allEvents.unshift(liveEv);
        }
      });
      // keep list trimmed to 5
      allEvents = allEvents.slice(0,5);
      // If the sidebar container is present, update it live
      if (container) container.innerHTML = `
      <div style="background:#fff8e6;border:1px solid #ffdca6;padding:12px;border-radius:8px;font-family:'Noto Sans Devanagari',sans-serif;">
        <h4 style="margin:0 0 8px;">🔔 आगामी कार्यक्रम</h4>
        ${buildListHtml(allEvents)}
      </div>`;
    } catch (e) {
      // ignore
      console.warn('Live-detect merge failed', e);
    }
  }

  // Build list HTML (shared used in modal and optional container)
  function buildListHtml(items) {
    if (!items || items.length === 0) return `<p>कोई आगामी कार्यक्रम नहीं मिला</p>`;
    let list = `<ul style="list-style:none; padding:0; margin:0;">`;
    items.forEach(ev => {
      const desc = ev.description ? `<br/><span style="color:#333;">${ev.description}</span>` : '';
      const place = ev.place ? `<br/><span style="color:#333;">📍 ${ev.place}</span>` : '';
      let address = '';
      if (ev.address) {
        const a = String(ev.address).trim();
        if (/^https?:\/\//i.test(a)) {
          address = `<br/><span style="color:#333;">🏠 <a href="${a}" target="_blank" rel="noopener noreferrer">ओपन लाइव / लिंक</a></span>`;
        } else {
          address = `<br/><span style="color:#333;">🏠 ${a}</span>`;
        }
      }
      // Only render displayDate if present (some promo items may intentionally hide it)
      const dateHtml = ev.displayDate ? `<span style="color:#666;">📅 ${ev.displayDate}</span>` : '';
      list += `
        <li style="margin:10px 0; padding:8px 0; border-bottom:1px dashed #e6e6e6; text-align:left;">
          <strong style="display:block;color:#222;">${ev.title}</strong>
          ${dateHtml}
          ${desc}
          ${place}
          ${address}
        </li>`;
    });
    list += `</ul>`;
    return list;
  }

  // Optional: inject into legacy container if present
  if (container) {
    container.innerHTML = `
      <div style="background:#fff8e6;border:1px solid #ffdca6;padding:12px;border-radius:8px;font-family:'Noto Sans Devanagari',sans-serif;">
        <h4 style="margin:0 0 8px;">🔔 आगामी कार्यक्रम</h4>
        ${buildListHtml(allEvents)}
      </div>`;
  }

  // keep a reference to current overlay so openNotifications won't duplicate
  let currentOverlay = null;

  // create and show modal
  function createModal() {
    // styles
    const style = document.createElement('style');
    style.setAttribute('data-notif-style','1');
    style.textContent = `
      .notif-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.36);display:flex;align-items:center;justify-content:center;z-index:9999}
      .notif-modal{background:#fff;border-radius:12px;max-width:720px;width:92%;max-height:86vh;overflow:auto;padding:18px;box-shadow:0 10px 40px rgba(0,0,0,0.28);font-family:'Noto Sans Devanagari',sans-serif}
      .notif-modal h2{margin:0 0 8px;color:#d35400}
      .notif-close{position:absolute;right:12px;top:8px;background:#fff;border:0;border-radius:50%;width:34px;height:34px;display:inline-flex;align-items:center;justify-content:center;font-size:18px;cursor:pointer}
      .notif-header{position:relative;padding-bottom:8px;border-bottom:1px solid #eee;margin-bottom:12px}
      .notif-actions{display:flex;gap:8px;align-items:center;margin-top:10px}
      @media (max-width:420px){.notif-modal{padding:12px;width:96%;}}
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.className = 'notif-overlay';
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.innerHTML = `
      <div class="notif-modal" role="document">
        <div class="notif-header">
          <h2>🔔 आगामी कार्यक्रम</h2>
          <button class="notif-close" aria-label="बंद करें">✕</button>
        </div>
        <div class="notif-body">
          ${buildListHtml(allEvents)}
        </div>
        <div class="notif-actions">
          <label style="margin-left:auto; font-size:0.95rem;color:#555;display:flex;align-items:center;gap:8px;">
            <input type="checkbox" id="notif-dont-show"/> आज के लिए बंद रखें
          </label>
        </div>
      </div>`;

    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.notif-close');
    const dontShowCheckbox = overlay.querySelector('#notif-dont-show');

    function closeModal() {
      try {
        if (dontShowCheckbox && dontShowCheckbox.checked) {
          localStorage.setItem(CLOSED_KEY, todayKey);
        }
      } catch (e) {}
      overlay.remove();
      // remove style tag
      const s = document.querySelector('style[data-notif-style]');
      if (s) s.remove();
      currentOverlay = null;
    }

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', function(e){ if (e.target === overlay) closeModal(); });
    window.addEventListener('keydown', function onKey(e){ if (e.key === 'Escape') { closeModal(); window.removeEventListener('keydown', onKey); } });

    // focus close button initially
    if (closeBtn) closeBtn.focus();

    currentOverlay = overlay;
    return overlay;
  }

  // Expose global function to open notifications modal on demand
  window.openNotifications = function() {
    // If already open, bring focus to it
    if (currentOverlay) {
      const btn = currentOverlay.querySelector('.notif-close');
      if (btn) btn.focus();
      return;
    }
    createModal();
  };

  // Wire header bell (if present) to reopen modal
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){
      const bell = document.getElementById('notif-bell');
      if (bell) bell.addEventListener('click', window.openNotifications);
    });
  } else {
    const bell = document.getElementById('notif-bell');
    if (bell) bell.addEventListener('click', window.openNotifications);
  }

  // If user closed modal today, don't auto-show on load
  try {
    const closedOn = localStorage.getItem(CLOSED_KEY);
    if (closedOn === todayKey) {
      return; // don't auto-show modal today
    }
  } catch (e) {
    // ignore localStorage errors
  }

  // Auto-show modal on first load (unless closed today)
  // Run live-detection first (if configured) and then open the modal.
  // Delay slightly to avoid interrupting synchronous page work.
  (async function(){
    try {
      await detectLiveStreamsAndMerge();
    } catch (e) {
      // ignore
    }
    setTimeout(() => { window.openNotifications(); }, 400);
  })();

})();

