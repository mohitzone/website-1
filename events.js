// Event cards data
window.events = [
  {
    date: "2025-11-05",  // for JS filtering/sorting
    displayDate: "05 सितंबर 2025", // for showing in Hindi
    title: "श्री गुरुनानक देव जयंती, विशेष सत्संग",
    description: "श्री गुरुनानक देव जी की जयंती के पावन अवसर पर विशेष सत्संग का आयोजन। प्रातः 9 बजे से आरंभ – भजन, कीर्तन, गुरुवाणी प्रवचन, चरण वंदना एवं प्रसाद वितरण।"
  },
  {
    date: "2025-12-27",
    displayDate: "27-28 दिसंबर 2025",
    title: "हरिद्वार वार्षिक उत्सव",
    description: "विशेष सत्संग, भजन-कीर्तन",
    place: "हरिद्वार निजधाम आश्रम",
    address: "पता: 339, जस्सा राम रोड, देवपुरा, हरिद्वार, उत्तराखंड 249401"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  // Generate Event Cards
  const eventsContainer = document.querySelector(".events-grid");
  events.forEach(e => {
      const card = document.createElement("div");
      card.classList.add("event-card");
      card.innerHTML = `
          <div class="event-date">${e.date}</div>
          <h4>${e.title}</h4>
          <p>${e.description}</p>
          ${e.place ? `<p><strong>स्थान:</strong> ${e.place}</p>` : ""}
          ${e.address ? `<p>${e.address}</p>` : ""}
      `;
      eventsContainer.appendChild(card);
  });
});

