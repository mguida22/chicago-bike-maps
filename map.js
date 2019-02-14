const chicagoBikeMap = () => {
  const SECOND = 1000
  const MINUTE = SECOND * 60
  const DAY = MINUTE * 60 * 24
  const TIME_INTERVAL = 5 * MINUTE
  const DISPLAY_INTERVAL = 400
  const TICKER_INTERVAL = 200

  let stations = {}
  let trips = []
  let counter = 0
  let interval = 0

  const timerElem = document.getElementById('time')
  const bikeMap = L.map('mapid').setView([41.903, -87.632], 11)

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
  ).addTo(bikeMap)

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

    startTrips.forEach(trip => {
      placeTripMarker(trip, true)
    })

    endTrips.forEach(trip => {
      placeTripMarker(trip, false)
    })
  }

  const placeTripMarker = (trip, isStart) => {
    // abort if we don't know about the station
    if (!stations[trip.from_station_id] || !stations[trip.to_station_id]) {
      return
    }

    let lat = stations[trip.to_station_id].latitude
    let long = stations[trip.to_station_id].longitude
    let newMarker = L.circle([lat, long], {
      color: isStart ? 'green' : 'red',
      opacity: 1.0,
      fillColor: isStart ? 'green' : 'red',
      fillOpacity: 0.5,
      radius: 50
    }).addTo(bikeMap)

    setTimeout(() => {
      bikeMap.removeLayer(newMarker)
    }, DISPLAY_INTERVAL)
  }

  const updateTime = () => {
    let hours = Math.floor(counter / (MINUTE * 60)).toString()
    let minutes = ((counter / MINUTE) % 60).toString()

    hours = hours.length === 2 ? hours : `0${hours}`
    minutes = minutes.length === 2 ? minutes : `0${minutes}`

    timerElem.innerHTML = `${hours}:${minutes}`
  }

  const startAnimation = () => {
    counter = 0
    interval = window.setInterval(() => {
      displayTrips()
      updateTime()
    }, TICKER_INTERVAL)
  }

  fetch('./public/stations.json')
    .then(data => data.json())
    .then(res => saveStations(res))

  fetch('./public/trips-2018-12-07.json')
    .then(data => data.json())
    .then(res => {
      saveTrips(res)
      startAnimation()
    })
}

chicagoBikeMap()
