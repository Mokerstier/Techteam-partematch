const fetch = require("node-fetch");

async function getEvents() {
	let eventCall = await fetch(
		"https://app.ticketmaster.com/discovery/v2/events.json?classificationName=Music&apikey=Do9gepc1WtDPAcM4fql6X0mjqjSMnPmv"
	);
	let events = await eventCall.json();
	return events;
}

module.exports = { getEvents };
