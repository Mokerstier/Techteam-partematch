let searchBar = document.getElementById("searchBar");
let timeOut;

console.log("event app running");

searchBar.addEventListener("input", e => {
	clearTimeout(timeOut);
	timeOut = setTimeout(() => replaceContent(e.srcElement.value), 500);
});

const replaceContent = query => {
	getEventsByKeywords(query).then(events => {
		let eventContainer = document.querySelector(".event-container");
		let emptyHeader = document.querySelector(".emptySearch");
		let child = eventContainer.lastElementChild;
		while (child) {
			eventContainer.removeChild(child);
			child = eventContainer.lastElementChild;
		}
		if (events._embedded) {
			if (!emptyHeader.classList.contains("hidden")) {
				emptyHeader.classList.add("hidden");
			}
			events._embedded.events.forEach(event => {
				addEventCard(event);
			});
		} else {
			if (emptyHeader.classList.contains("hidden")) {
				emptyHeader.classList.remove("hidden");
			}
		}
		function addEventCard(event) {
			let img = event.images.find(obj => {
				return obj.ratio === "16_9" && obj.width === 1024;
			});
			let eventEl = document.createElement("div");
			const eventMarkup = `
	            <img src="${img.url}" alt="${event.name}"/>
	            <h3>${event.name}</h3>
	            <form class="event-addForm" action="/addEvent" method="POST">
		        <input type="hidden" value="${event.id}" name="eventID"/>
		        <input type="submit" value="Add to Profile" />
	            </form>
            `;
			eventEl.classList.add("event-card");
			eventEl.innerHTML = eventMarkup;
			eventContainer.appendChild(eventEl);
		}
	});
};

async function getEventsByKeywords(keywords) {
	keywords.replace("\\s+", "%20");
	let eventCall = await fetch(`/getEvents/${keywords}`);
	let events = await eventCall.json();
	return events;
}
