let AirportData = require("./utils/airportdata");

var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) 
{
    let airportdata = new AirportData();

    let originIcao = "EDDK";
    let destinationIcao = "EDDM";

    let origin = airportdata.getAirport(originIcao);    
    let destination = airportdata.getAirport(destinationIcao);

    let distance = airportdata.calcDistanceLatLong(origin.lat, origin.lon, destination.lat, destination.lon);

    let maxDistance = 125;
    let airportsInRange = airportdata.airportsInRange(originIcao, maxDistance);

    res.render('airports', 
        {
            title: "Airports-Test",
            origin: originIcao,
            originLat: origin.lat,
            originLong: origin.lon,
            destination: destinationIcao, 
            destinationLat: destination.lat,
            destinationLong: destination.lon,
            distance: distance,

            maxDistance: maxDistance,
            airportsInRange: airportsInRange
        }
    );
});

module.exports = router;
