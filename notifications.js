// // notifications.js
// // Collects next 5 upcoming events from calander.js and events.js and displays them in the notification tab

// function parseHindiDate(dateStr) {
//     const months = {
//         'जनवरी': 0, 'फ़रवरी': 1, 'फरवरी': 1, 'मार्च': 2, 'अप्रैल': 3,
//         'मई': 4, 'जून': 5, 'जुलाई': 6, 'अगस्त': 7, 'सितंबर': 8,
//         'सितम्बर': 8, 'अक्टूबर': 9, 'नवंबर': 10, 'नवम्बर': 10, 'दिसंबर': 11, 'दिसम्बर': 11
//     };

//     // Handle ranges like "27-28 दिसंबर 2025"
//     const rangeMatch = dateStr.match(/^(\d{1,2})-(\d{1,2}) ([\p{L}]+)(?: (\d{4}))?/u);
//     if (rangeMatch) {
//         const day = parseInt(rangeMatch[1], 10);
//         const monthName = rangeMatch[3];
//         const month = months[monthName];
//         const year = rangeMatch[4] ? parseInt(rangeMatch[4], 10) : new Date().getFullYear();
//         if (month !== undefined) return new Date(year, month, day);
//     }

//     // Normal case like "16 अगस्त 2025"
//     const match = dateStr.match(/(\d{1,2}) ([\p{L}]+)(?: (\d{4}))?/u);
//     if (match) {
//         const day = parseInt(match[1], 10);
//         const monthName = match[2];
//         const month = months[monthName];
//         const year = match[3] ? parseInt(match[3], 10) : new Date().getFullYear();
//         if (month !== undefined) return new Date(year, month, day);
//     }

//     return null;
// }

// function getUpcomingEvents() {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     let allEvents = [];

//     // From calendar.js
//     if (window.calendar) {
//         window.calendar.forEach(monthObj => {
//             monthObj.events.forEach(eventStr => {
//                 // Try to extract date from event string
//                 const dateMatch = eventStr.match(/(\\d{1,2}(?:-\\d{1,2})? [\\p{L}]+(?: \\d{4})?)/u);
//                 if (dateMatch) {
//                     const date = parseHindiDate(dateMatch[1]);
//                     if (date) {
//                         allEvents.push({
//                             date,
//                             rawDate: dateMatch[1],
//                             title: eventStr,
//                             source: 'calendar'
//                         });
//                     }
//                 }
//             });
//         });
//     }

//     // From events.js
//     if (window.events) {
//         window.events.forEach(event => {
//             const date = parseHindiDate(event.date);
//             if (date) {
//                 allEvents.push({
//                     date,
//                     rawDate: event.date,
//                     title: event.title,
//                     description: event.description,
//                     source: 'events'
//                 });
//             }
//         });
//     }

//     // Remove duplicates: same date + same title
//     allEvents = allEvents.filter((ev, index, self) =>
//         index === self.findIndex(e =>
//             e.date.getTime() === ev.date.getTime() &&
//             e.title.trim() === ev.title.trim()
//         )
//     );

//     // Sort by date
//     allEvents.sort((a, b) => a.date - b.date);

//     // Return next 5 events
//     return allEvents.filter(ev => ev.date >= today).slice(0, 5);
// }

// window.addEventListener("DOMContentLoaded", () => {
//     const tab = document.getElementById("notification-tab");
//     if (!tab) return;
//     const upcoming = getUpcomingEvents();
//     tab.innerHTML = `<h3 style="margin-bottom:0.7rem;color:#d35400;font-size:1.2rem;">🔔 आगामी कार्यक्रम</h3>` +
//         upcoming.map(ev => {
//             if (ev.source === "events") {
//                 return `<div style="margin-bottom:0.7rem;padding:0.7rem 1rem;background:#fffbe6;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.07);">
//                     <strong>${ev.rawDate}:</strong> <span style="color:#d35400;">${ev.title}</span><br>
//                     <span style="font-size:0.98rem;">${ev.description || ""}</span>
//                 </div>`;
//             } else {
//                 return `<div style="margin-bottom:0.7rem;padding:0.7rem 1rem;background:#fffbe6;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,0.07);">
//                     <strong>${ev.rawDate}:</strong> <span>${ev.title}</span>
//                 </div>`;
//             }
//         }).join("");
// });






// notifications.js








// (function () {
//   const container = document.getElementById("notification-tab");
//   if (!container) return;

//   const today = new Date();

//   // Ensure events exist
//   const events = (window.events || []).map(e => {
//     return {
//       ...e,
//       jsDate: new Date(e.date) // convert ISO date to Date object
//     };
//   });

//   // Filter only upcoming events
//   const upcomingEvents = events.filter(e => e.jsDate >= today);

//   // Sort by date
//   upcomingEvents.sort((a, b) => a.jsDate - b.jsDate);

//   // Create notification block
//   let html = `<div class="notification-box" style="
//                 background:#fff3cd;
//                 border:1px solid #ffeeba;
//                 padding:10px;
//                 border-radius:8px;
//                 text-align:center;
//                 font-family: 'Noto Sans Devanagari', sans-serif;
//               ">
//                 <h3 style="margin-top:0;">🔔 आगामी कार्यक्रम</h3>`;

//   if (upcomingEvents.length === 0) {
//     html += `<p>कोई आगामी कार्यक्रम नहीं है।</p>`;
//   } else {
//     html += `<ul style="list-style:none; padding:0;">`;
//     upcomingEvents.forEach(ev => {
//       html += `
//         <li style="margin:8px 0; padding:6px; border-bottom:1px dashed #ccc;">
//           <strong>${ev.title}</strong><br/>
//           <span style="color:#555;">📅 ${ev.displayDate || ev.date}</span><br/>
//           <span style="font-size:14px;">${ev.description || ""}</span>
//           ${ev.place ? `<br/><span>📍 ${ev.place}</span>` : ""}
//           ${ev.address ? `<br/><span>🏠 ${ev.address}</span>` : ""}
//         </li>
//       `;
//     });
//     html += `</ul>`;
//   }

//   html += `</div>`;

//   // Inject into container
//   container.innerHTML = html;
// })();






// notifications.js

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

