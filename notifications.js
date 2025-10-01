// notifications.js

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
  const allEvents = [...events, ...calendarEvents]
    .filter(e => e.date >= today)   // only upcoming
    .sort((a, b) => a.date - b.date)
    .slice(0, 5); // take next 5

  // Build list HTML (shared used in modal and optional container)
  function buildListHtml(items) {
    if (!items || items.length === 0) return `<p>कोई आगामी कार्यक्रम नहीं मिला</p>`;
    let list = `<ul style="list-style:none; padding:0; margin:0;">`;
    items.forEach(ev => {
      const desc = ev.description ? `<br/><span style="color:#333;">${ev.description}</span>` : '';
      const place = ev.place ? `<br/><span style="color:#333;">📍 ${ev.place}</span>` : '';
      const address = ev.address ? `<br/><span style="color:#333;">🏠 ${ev.address}</span>` : '';
      list += `
        <li style="margin:10px 0; padding:8px 0; border-bottom:1px dashed #e6e6e6; text-align:left;">
          <strong style="display:block;color:#222;">${ev.title}</strong>
          <span style="color:#666;">📅 ${ev.displayDate}</span>
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
  // Delay slightly to avoid interrupting synchronous page work
  setTimeout(() => { window.openNotifications(); }, 400);

})();

