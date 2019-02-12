let markers = {}

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

const populateMap = stations => {
  stations.forEach(station => {
    markers[station.id] = L.marker([station.latitude, station.longitude])
      .addTo(mymap)
      .bindPopup(station.stationName)
  })
}

fetch('./data/stations.json')
  .then(data => data.json())
  .then(res => populateMap(res))
