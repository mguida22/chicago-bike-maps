let stations = {}
let tripMarkers = {}

const mymap = L.map('mapid').setView([41.87, -87.63], 10)

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

const displayTrips = trips => {
  trips.forEach(trip => {
    tripMarkers[trip.trip_id] = {}

    // abort if we don't know about the station
    if (!stations[trip.from_station_id] || !stations[trip.to_station_id]) {
      return
    }

    let lat = stations[trip.from_station_id].latitude
    let long = stations[trip.from_station_id].longitude
    tripMarkers[trip.trip_id].start = L.circle([lat, long], {
      color: 'green',
      opacity: 0.5,
      fillColor: 'green',
      fillOpacity: 0.1,
      radius: 50
    }).addTo(mymap)

    lat = stations[trip.to_station_id].latitude
    long = stations[trip.to_station_id].longitude
    tripMarkers[trip.trip_id].end = L.circle([lat, long], {
      color: 'red',
      opacity: 0.5,
      fillColor: 'red',
      fillOpacity: 0.1,
      radius: 50
    }).addTo(mymap)
  })
}

bikeid: '848'
end_time: '2018-12-07 00:55:53'
from_station_id: '60'
start_time: '2018-12-07 00:00:34'
to_station_id: '484'
trip_id: '21621607'
tripduration: '3,319.0'

fetch('./data/stations.json')
  .then(data => data.json())
  .then(res => saveStations(res))

fetch('./data/trips-2018-12-07.json')
  .then(data => data.json())
  .then(res => displayTrips(res))
