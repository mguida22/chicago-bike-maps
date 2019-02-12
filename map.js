const SECOND = 1000
const MINUTE = SECOND * 60
const DAY = MINUTE * 60 * 24
const TIME_INTERVAL = MINUTE * 4
let stations = {}
let trips = []
let tripMarkers = {}
let counter = 0
let interval = 0

const mymap = L.map('mapid').setView([41.87, -87.63], 11)

L.tileLayer(
  'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}',
  {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/" target="_blank">OpenStreetMap</a>, Imagery © <a href="https://www.mapbox.com/" target="_blank">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.dark',
    accessToken:
      'pk.eyJ1IjoibWd1aWRhMjIiLCJhIjoiY2oyd3BocWczMDFrNDJxbXNoemZ4NjIzbCJ9.i1N1SKhuEqCu4CjfUYk5eA'
  }
).addTo(mymap)

const saveStations = incomingStations => {
  incomingStations.forEach(s => {
    stations[s.id] = s
  })
}

const saveTrips = incomingTrips => {
  trips = incomingTrips
}

const filterTrips = (time, station_id) => {
  // abort if we don't know about the station
  if (!stations[station_id]) {
    return
  }

  // time of the day in ms
  timeOfDay = Date.parse(time) - Date.parse('2018-12-07 00:00:00')
  return timeOfDay > counter && timeOfDay < counter + TIME_INTERVAL
}

const displayTrips = () => {
  const startTrips = trips.filter(trip =>
    filterTrips(trip.start_time, trip.from_station_id)
  )
  const endTrips = trips.filter(trip =>
    filterTrips(trip.end_time, trip.to_station_id)
  )
  counter += TIME_INTERVAL
  if (counter >= DAY) {
    window.clearInterval(interval)
  }

  console.log(startTrips.length, endTrips.length, counter)

  startTrips.forEach(trip => {
    placeTripMarker(trip, true)
  })

  endTrips.forEach(trip => {
    placeTripMarker(trip, false)
  })

  window.setTimeout(() => {
    startTrips.forEach(trip => {
      removeTripMarker(trip.trip_id, true)
    })
    endTrips.forEach(trip => {
      removeTripMarker(trip.trip_id, false)
    })
  }, 90)
}

const removeTripMarker = (trip_id, isStart) => {
  console.log('yo', trip_id)
  // pass if we don't have a marker
  if (!tripMarkers[trip_id]) {
    return
  }

  if (isStart) {
    mymap.removeLayer(tripMarkers[trip_id].start)
  } else {
    mymap.removeLayer(tripMarkers[trip_id].end)
  }
}

const placeTripMarker = (trip, isStart) => {
  // abort if we don't know about the station
  if (!stations[trip.from_station_id] || !stations[trip.to_station_id]) {
    return
  }

  // if there's no start marker, don't show the end
  if (!isStart && !tripMarkers[trip.trip_id]) {
    return
  }

  let lat = stations[trip.to_station_id].latitude
  let long = stations[trip.to_station_id].longitude
  let newMarker = L.circle([lat, long], {
    color: isStart ? 'green' : 'red',
    opacity: 0.5,
    fillColor: isStart ? 'green' : 'red',
    fillOpacity: 0.1,
    radius: 50
  }).addTo(mymap)

  if (isStart) {
    tripMarkers[trip.trip_id] = {
      start: newMarker
    }
  } else {
    tripMarkers[trip.trip_id].end = newMarker
  }
}

const startAnimation = () => {
  counter = 0
  interval = window.setInterval(displayTrips, 50)
}

fetch('./data/stations.json')
  .then(data => data.json())
  .then(res => saveStations(res))

fetch('./data/trips-2018-12-07.json')
  .then(data => data.json())
  .then(res => {
    saveTrips(res)
    startAnimation()
  })
