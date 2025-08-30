// notifications.js

(function () {
  const container = document.getElementById("notification-tab");
  if (!container) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Ignore time for comparison

  // ===== Handle window.events (structured events.js) =====
  const events = (window.events || []).map(e => {
    let parsedDate = new Date(e.date); // assumes ISO/valid format
    return {
      title: e.title,
      description: e.description || "",
      place: e.place || "",
      address: e.address || "",
      date: parsedDate,
      displayDate: e.displayDate || e.date
    };
  });

  // ===== Handle window.calendar (structured calander.js) =====
  const calendarEvents = [];
  (window.calendar || []).forEach(month => {
    (month.events || []).forEach(ev => {
      // ev is an object: { day, weekday, title }
      if (typeof ev === 'object' && ev.day && month.month && month.year) {
        // Parse date from day, month, year
        const monthsMap = {
          "जनवरी":0,"फ़रवरी":1,"फरवरी":1,"मार्च":2,"अप्रैल":3,"मई":4,"जून":5,
          "जुलाई":6,"अगस्त":7,"सितंबर":8,"सितम्बर":8,"अक्टूबर":9,"नवंबर":10,"नवम्बर":10,"दिसंबर":11,"दिसम्बर":11
        };
        const monthIndex = monthsMap[month.month];
        if (monthIndex !== undefined) {
          const parsedDate = new Date(month.year, monthIndex, ev.day);
          calendarEvents.push({
            title: ev.title,
            description: "",
            place: "",
            address: "",
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

  // ===== Build HTML =====
  let html = `<div class="notification-box" style="
                background:#fff3cd;
                border:1px solid #ffeeba;
                padding:10px;
                border-radius:8px;
                text-align:center;
                font-family: 'Noto Sans Devanagari', sans-serif;
              ">
                <h3 style="margin-top:0;">🔔 आगामी कार्यक्रम</h3>`;

  if (allEvents.length > 0) {
    html += `<ul style="list-style:none; padding:0;">`;
    allEvents.forEach(ev => {
      html += `
        <li style="margin:8px 0; padding:6px; border-bottom:1px dashed #ccc;">
          <strong>${ev.title}</strong><br/>
          <span style="color:#555;">📅 ${ev.displayDate}</span>
          ${ev.description ? `<br/><span>${ev.description}</span>` : ""}
          ${ev.place ? `<br/><span>📍 ${ev.place}</span>` : ""}
          ${ev.address ? `<br/><span>🏠 ${ev.address}</span>` : ""}
        </li>
      `;
    });
    html += `</ul>`;
  } else {
    html += `<p>कोई आगामी कार्यक्रम नहीं मिला</p>`;
  }

  html += `</div>`;

  // Inject into DOM
  container.innerHTML = html;
})();

