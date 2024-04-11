const endpoint = 'https://cors-proxy.appadooapoorva.workers.dev/https://data-cloud.flightradar24.com/zones/fcgi/feed.js?'
const flight_endpoint = 'https://cors-proxy.appadooapoorva.workers.dev/https://data-live.flightradar24.com/clickhandler/'

const defaults = {
	FAA: true,        // use US/Canada radar data source
	FLARM: true,      // use FLARM data source
	MLAT: true,       // use MLAT data source
	ADSB: true,       // use ADS-B data source
	SATELLITE: true,  // use SATELLITE data source

	inAir: true,      // fetch airborne aircraft
	onGround: true,   // fetch (active) aircraft on ground
	inactive: true,   // fetch inactive aircraft (on ground)
	gliders: true,    // fetch gliders
	estimatedPositions: false, // if out of coverage

	airline: [],  // The airline ICAO code to fetch aircraft from (e.g. AFR for Air France)
	callsign: [], // The call signs to fetch aircraft from (e.g.SFR850)
	flight: [],   // The flight numbers to fetch aircraft from (e.g. FA850)
	reg: [],      // The aircraft registration numbers to fetch aircraft from (e.g. F-GZNP)
	type: [],     // The aircraft model codes to fetch aircraft from (e.g. A320)
	airport: []   // The Airports ICAO codes to fetch aircraft from (e.g. LFPG)
}

function fetchFromRadar(north, south, west, east, when, opt = {}) {
	if ('number' !== typeof north) throw new TypeError('north must be a number')
	if ('number' !== typeof west) throw new TypeError('west must be a number')
	if ('number' !== typeof south) throw new TypeError('south must be a number')
	if ('number' !== typeof east) throw new TypeError('east must be a number')
	if (when && 'number' !== typeof when) throw new TypeError('when must be a number')
	opt = {
		...defaults,
		...opt,
	}

	const query = {
    	// bbox
		bounds: [north, south, west, east].join(','),
		
		faa: opt.FAA ? '1' : '0',
		flarm: opt.FLARM ? '1' : '0',
		mlat: opt.MLAT ? '1' : '0',
		adsb: opt.ADSB ? '1' : '0',
    	satellite: opt.SATELLITE ? '1' : '0',

		air: opt.inAir ? '1' : '0',
		gnd: opt.onGround ? '1' : '0',
		vehicles: opt.inactive ? '1' : '0',
		gliders: opt.gliders ? '1' : '0',
		estimated: opt.estimatedPositions ? '1' : '0',

		airline: opt.airline.join(','),
		callsign: opt.callsign.join(','),
		flight: opt.flight.join(','),
		reg: opt.reg.join(','),
		type: opt.type.join(','),
		airport: opt.airport.join(',')

		// todo: maxage, stats, history, prefetch
	}
	if (when) query.history = Math.round(when / 1000)

	const url = endpoint;

  return mars3d.Util.fetchJson({
    url: url,
    queryParameters: query
  })

}

function getAircrafts(data) {
	const aircrafts = []
	totals = 0;
	for (let id in data) {
		const d = data[id]
		if (d.constructor !== Array) {
			if (id=="full_count")
				totals = data[id];
			continue
    	}
		aircrafts.push({
			id,
			registration: d[9] ?? null,
			flight: d[13] ?? null,
			callsign: d[16] ?? null, // ICAO ATC call signature
			origin: d[11] ?? null, // airport IATA code
			destination: d[12] ?? null, // airport IATA code
			latitude: d[1],
			longitude: d[2],
			altitude: d[4], // in feet
			bearing: d[3], // in degrees
			speed: d[5] ?? null, // in knots
			rateOfClimb: d[15], // ft/min
			isOnGround: !!d[14],
			squawkCode: d[6], // https://en.wikipedia.org/wiki/Transponder_(aeronautics)
			model: d[8] ?? null, // ICAO aircraft type designator
			modeSCode: d[0] ?? null, // ICAO aircraft registration number
			radar: d[7], // F24 "radar" data source ID
			isGlider: !!d[17],
			timestamp: d[10] ?? null,
		})
	}
	return {
		"totals": totals,
		"fetched": aircrafts.length,
		"list": aircrafts
	}
}

  /**
  * Returns the destination point from a given point, having travelled the given distance
  * on the given initial bearing.
  *
  * @param   {number} lat - initial latitude in decimal degrees (eg. 50.123)
  * @param   {number} lon - initial longitude in decimal degrees (e.g. -4.321)
  * @param   {number} distance - Distance travelled (metres).
  * @param   {number} bearing - Initial bearing (in degrees from north).
  * @returns {array} destination point as [latitude,longitude] (e.g. [50.123, -4.321])
  *
  * @example
  *     var p = destinationPoint(51.4778, -0.0015, 7794, 300.7); // 51.5135°N, 000.0983°W
  */
function destinationPoint(lat, lon, distance, bearing) {
	var radius = 6371e3; // (Mean) radius of earth

	var toRadians = function(v) { return v * Math.PI / 180; };
	var toDegrees = function(v) { return v * 180 / Math.PI; };

	// sinφ2 = sinφ1·cosδ + cosφ1·sinδ·cosθ
	// tanΔλ = sinθ·sinδ·cosφ1 / cosδ−sinφ1·sinφ2
	// see mathforum.org/library/drmath/view/52049.html for derivation

	var δ = Number(distance) / radius; // angular distance in radians
	var θ = toRadians(Number(bearing));

	var φ1 = toRadians(Number(lat));
	var λ1 = toRadians(Number(lon));

	var sinφ1 = Math.sin(φ1), cosφ1 = Math.cos(φ1);
	var sinδ = Math.sin(δ), cosδ = Math.cos(δ);
	var sinθ = Math.sin(θ), cosθ = Math.cos(θ);

	var sinφ2 = sinφ1*cosδ + cosφ1*sinδ*cosθ;
	var φ2 = Math.asin(sinφ2);
	var y = sinθ * sinδ * cosφ1;
	var x = cosδ - sinφ1 * sinφ2;
	var λ2 = λ1 + Math.atan2(y, x);

	return [toDegrees(φ2), (toDegrees(λ2)+540)%360-180]; // normalise to −180..+180°
}





function fetchFlight(flight) {
	if ('string' !== typeof flight) throw new TypeError('flight must be a string')
	const url = flight_endpoint;
	const query = {flight, version: '1.5'};
	return mars3d.Util.fetchJson({
		url: url,
		queryParameters: query
	})
}

function getFlight(d) {
	const orig = d.airport?.origin ?? {}
	const dest = d.airport?.destination ?? {}
	const time = d.time ?? {}

	/*
	let dep = time.real?.departure ?? time.estimated?.departure ?? time.scheduled?.departure
	if (dep) dep = moment.tz(dep * 1000, orig.timezone?.name ?? null).format()
	let sDep = time.scheduled?.departure
	if (sDep) sDep = moment.tz(sDep * 1000, orig.timezone?.name ?? null).format()

	let arr = time.real?.arrival ?? time.estimated?.arrival ?? time.scheduled?.arrival
	if (arr) arr = moment.tz(arr * 1000, dest.timezone?.name ?? null).format()
	let sArr = time.scheduled?.arrival
	if (sArr) sArr = moment.tz(sArr * 1000, dest.timezone?.name ?? null).format()
	*/
	let delay = time.historical?.delay ?? null
	if (delay) delay = parseInt(delay)

	return {
		id: d.identification?.id ?? null,
		callsign: d.identification?.callsign ?? null,
		liveData: d.status?.live ?? null,
		model: d.aircraft?.model?.code ?? null,
		registration: d.aircraft?.registration ?? null,
		airline: d.airline?.code?.iata ?? null,
		origin: {
			id: orig.code?.iata ?? null,
			name: orig.name ?? null,
			coordinates: {
				latitude: orig.position?.latitude ?? null,
				longitude: orig.position?.longitude ?? null,
				altitude: orig.position?.altitude ?? null,
			},
			timezone: orig.timezone?.name ?? null,
			country: orig.position?.country?.code ?? null,
		},
		destination: {
			id: dest.code?.iata ?? null,
			name: dest.name ?? null,
			coordinates: {
				latitude: dest.position?.latitude ?? null,
				longitude: dest.position?.longitude ?? null,
				altitude: dest.position?.altitude ?? null,
			},
			timezone: dest.timezone?.name ?? null,
			country: dest.position?.country?.code ?? null,
		},
		/*
		departure: dep || null,
		
		scheduledDeparture: sDep || null,
		departureTerminal: orig.info?.terminal ?? null,
		departureGate: orig.info?.gate ?? null,
		arrival: arr || null,
		scheduledArrival: sArr || null,
		arrivalTerminal: dest.info?.terminal ?? null,
		arrivalGate: dest.info?.gate ?? null,
		*/
		delay, // in seconds
		// todo: d.time.historical.flighttime
		// todo: d.flightHistory
		// todo: d.trail
		// todo: what is d.s?
	}
}