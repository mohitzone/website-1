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

    // Generate Calendar
    const calendarContainer = document.querySelector(".monthly-calendar");
    calendar.forEach(m => {
        const block = document.createElement("div");
        block.classList.add("month-block");
        block.innerHTML = `
            <h4>${m.month}</h4>
            <ul>${m.events.map(ev => `<li>${ev}</li>`).join("")}</ul>
        `;
        calendarContainer.appendChild(block);
    });
});
