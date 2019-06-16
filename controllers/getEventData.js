const fetch = require("node-fetch");
require("dotenv").config();

async function getEvents() {
	let eventCall = await fetch(
		`https://app.ticketmaster.com/discovery/v2/events.json?&classificationName=Music&locale=*&countryCode=NL&keyword=festival&apikey=${
			process.env.TICKETMASTER_KEY
		}`
	);
	let events = await eventCall.json();
	return events;
}
async function getEventById(id) {
	let eventCall = await fetch(
		`https://app.ticketmaster.com/discovery/v2/events.json?&classificationName=Music&locale=*&countryCode=NL&id=${id}&apikey=${
			process.env.TICKETMASTER_KEY
		}`
	);
	let eventObject = await eventCall.json();
	return eventObject;
}

module.exports = { getEvents, getEventById };
