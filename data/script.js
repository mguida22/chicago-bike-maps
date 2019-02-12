const fs = require('fs')
const got = require('got')

const STATION_DATA_URL = 'https://feeds.divvybikes.com/stations/stations.json'
got('https://feeds.divvybikes.com/stations/stations.json', { json: true })
  .then(response => {
    const data = response.body['stationBeanList']

    let filteredData = data.map(station => {
      return {
        id: station.id,
        stationName: station.stationName,
        latitude: station.latitude,
        longitude: station.longitude
      }
    })

    fs.writeFile('stations.json', JSON.stringify(filteredData), 'utf8', () => {
      console.log('saved station data to stations.json')
    })
  })
  .catch(error => {
    console.log(error.response.body)
  })
