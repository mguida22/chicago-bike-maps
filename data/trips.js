const fs = require('fs')
const csvtojson = require('csvtojson')

const csvFilePath = './divvy-data/Divvy_Trips_2018_Q4.csv'

csvtojson()
  .fromFile(csvFilePath)
  .then(jsonObj => {
    trips = jsonObj.map(trip => {
      return {
        trip_id: trip.trip_id,
        start_time: trip.start_time,
        end_time: trip.end_time,
        bikeid: trip.bikeid,
        tripduration: trip.tripduration,
        from_station_id: trip.from_station_id,
        to_station_id: trip.to_station_id
      }
    })

    fs.writeFile('trips.json', JSON.stringify(trips), 'utf8', () => {
      console.log('saved trips data to trips.json')
    })

    oneDayTrips = trips.filter(
      trip => trip.start_time.substr(0, 10) === '2018-12-07'
    )

    fs.writeFile(
      'trips-2018-12-07.json',
      JSON.stringify(oneDayTrips),
      'utf8',
      () => {
        console.log('saved trips data for 2018-12-07 to trips-2018-12-07.json')
      }
    )
  })
