// Event cards data
window.events = [
  {
    date: "2025-07-10",  // for JS filtering/sorting
    displayDate: "10 जुलाई 2025", // for showing in Hindi
    title: "गुरु पूर्णिमा विशेष सत्संग",
    description: "श्री गुरुदेव को समर्पित दिव्य सत्संग, प्रातः 9 बजे से। भजन, प्रवचन, चरण वंदना एवं महाप्रसाद वितरण।"
  },
  {
    date: "2025-08-16",
    displayDate: "16 अगस्त 2025",
    title: "श्रीकृष्ण जन्माष्टमी महोत्सव",
    description: "विशेष कीर्तन, लंगर सेवा एवं सत्संग सभा। समय: दोपहर 12 बजे से, स्थान: उल्हासनगर आश्रम।"
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

