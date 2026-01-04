// Event cards data
window.events = [
  {
    dates: ["2026-02-13", "2026-02-18"],
    displayDate: "13-18 फरवरी 2026",
    title: "",
    description: "",
    image: ["images/invitation1.png", "images/invitation2.png", "images/invitation3.png", "images/invitation4.png"]
  },
  {
    date: "2026-02-13",
    displayDate: "13 फरवरी 2026 (शुक्रवार)",
    title: "151वां प्रकटोत्सव - शुभारंभ एवं श्री साईं कृष्णदास जी का सत्संग",
    description: "सुबह 8 बजे: श्री गुरुग्रंथ साहिब अखंड पाठ का शुभारंभ।<br> शाम 5 से 8 बजे: <strong>श्री साईं कृष्णदास जी (चकरभाटा)</strong> का सत्संग, कथा और कीर्तन।",
    place: "निजधाम आश्रम, ग्वालियर",
    address: "संत जयबाबा मार्ग, श्री राम पैलेस के पीछे, लश्कर, ग्वालियर",
    image: "images/13-feb.jpeg"
  },
  {
    date: "2026-02-14",
    displayDate: "14 फरवरी 2026 (शनिवार)",
    title: "स्वामी भगत प्रकाश जी महाराज सत्संग",
    description: "शाम 5 से 8:30 तक: प्रेम प्रकाश आश्रम के संत <strong>शिरोमणि श्री श्री 108 स्वामी भगत प्रकाश जी महाराज</strong> का विशेष सत्संग, भजन और कीर्तन।",
    place: "निजधाम आश्रम, ग्वालियर",
    address: "संत जयबाबा मार्ग, श्री राम पैलेस के पीछे, लश्कर, ग्वालियर",
    image: "images/14-feb.jpeg"
  },
  {
    dates: ["2026-02-15", "2026-02-16", "2026-02-17"],
    displayDate: "15-17 फरवरी 2026",
    title: "महाशिवरात्रि एवं वीर बजरंगबली हनुमान कथा",
    description: "15 फरवरी (महाशिवरात्रि): सुबह 8 बजे कलश/शोभा यात्रा एवं हवन।<br> 15 से 17 फरवरी (रोजाना शाम 4 से 7): <strong>पं. सतीश कौशिक जी</strong> द्वारा प्रभु श्री राम के अनन्य भक्त 'वीर बजरंगबली हनुमान' जी की कथा।",
    place: "निजधाम आश्रम, ग्वालियर",
    address: "संत जयबाबा मार्ग, श्री राम पैलेस के पीछे, लश्कर, ग्वालियर",
    image: "images/15-17-feb.jpeg"
  },
  {
    date: "2026-02-18",
    displayDate: "18 फरवरी 2026 (बुधवार)",
    title: "हवन, संत भंडारा और आम भंडारा",
    description: "सुबह 9 बजे: हवन। दोपहर 1 बजे: आम भंडारा प्रसादी।<br> शाम 6 बजे: पल्लव और कार्यक्रम की समाप्ति।",
    place: "निजधाम आश्रम, ग्वालियर",
    address: "संत जयबाबा मार्ग, श्री राम पैलेस के पीछे, लश्कर, ग्वालियर",
    //image: "images/poster-18-feb.jpg"
  }
];

document.addEventListener("DOMContentLoaded", () => {
  const eventsContainer = document.querySelector(".events-grid");
  events.forEach(e => {
    const card = document.createElement("div");
    card.classList.add("event-card");
    card.innerHTML = `
      ${e.displayDate || e.date || e.dates ? `<div class="event-date">${e.displayDate || (Array.isArray(e.dates) ? e.dates.join(" - ") : e.date)}</div>` : ""}
      ${e.image ? (Array.isArray(e.image) ? `<div class="invitation-slider">${e.image.map((img, index) => `<img src="${img}" alt="${e.title}" class="invitation-slide ${index === 0 ? 'active' : ''}">`).join('')}</div>` : `<img src="${e.image}" alt="${e.title}" class="event-image">`) : ""}
      <h4>${e.title}</h4>
      <p>${e.description}</p>
      ${e.place ? `<p><strong>स्थान:</strong> ${e.place}</p>` : ""}
      ${e.address ? `<p>${e.address}</p>` : ""}
    `;
    eventsContainer.appendChild(card);
  });
  
  // Invitation slider functionality
  const invitationSliders = document.querySelectorAll('.invitation-slider');
  invitationSliders.forEach(slider => {
    let currentSlide = 0;
    const slides = slider.querySelectorAll('.invitation-slide');
    const totalSlides = slides.length;
    
    function nextSlide() {
      slides[currentSlide].classList.remove('active');
      currentSlide = (currentSlide + 1) % totalSlides;
      slides[currentSlide].classList.add('active');
    }
    
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
  });
});

