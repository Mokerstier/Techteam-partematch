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
		if (!eventContainer) {
			let emptyHeader = document.querySelector(".emptySearch");
			let newContainer = document.createElement("div");
			newContainer.setAttribute("class", "event-container");
			emptyHeader.parentNode.replaceChild(newContainer, emptyHeader);
		}
		let child = eventContainer.lastElementChild;
		while (child) {
			eventContainer.removeChild(child);
			child = eventContainer.lastElementChild;
		}
		if (events._embedded) {
			events._embedded.events.forEach(event => {
				let eventEl = document.createElement("div");
				let eventImg = document.createElement("img");
				let eventName = document.createElement("h3");
				let addForm = document.createElement("form");
				let hiddenInput = document.createElement("input");
				let submitInput = document.createElement("input");
				console.log(event);
				console.log(event.images);
				let img = event.images.find(obj => {
					return obj.ratio === "16_9" && obj.width === 1024;
				});

				eventEl.setAttribute("class", "event-card");
				eventImg.setAttribute("src", img.url);
				eventName.innerText = event.name;
				addForm.setAttribute("class", "event-addForm");
				addForm.setAttribute("action", "/addEvent");
				addForm.setAttribute("method", "POST");
				hiddenInput.setAttribute("type", "hidden");
				hiddenInput.setAttribute("value", event.id);
				hiddenInput.setAttribute("name", "eventID");
				submitInput.setAttribute("type", "submit");
				submitInput.setAttribute("value", "Add to Profile");

				addForm.appendChild(hiddenInput);
				addForm.appendChild(submitInput);
				eventEl.appendChild(eventImg);
				eventEl.appendChild(eventName);
				eventEl.appendChild(addForm);
				eventContainer.appendChild(eventEl);
			});
		} else {
			let notFound = document.createElement("h3");
			notFound.innerText = "Nothing found, try other keywords";
			notFound.setAttribute("class", "emptySearch");
			eventContainer.parentNode.replaceChild(notFound, eventContainer);
		}
	});
};

async function getEventsByKeywords(keywords) {
	keywords.replace("\\s+", "%20");
	// console.log(keywords);
	let eventCall = await fetch(`/getEvents/${keywords}`);
	let events = await eventCall.json();
	return events;
}
