let ICAOS = require("./icaos");

class AirportData
{
    constructor()
    {
        console.log("ICAOS.length: " + ICAOS.length);
    }

    getAirport(icao)
    {
        return ICAOS.find((e) => e.icao == icao.toUpperCase());
    }

    dump(icao)
    {
        let airport = this.getAirport(icao);
        return JSON.stringify(airport);
    }

    calcDistanceIcaoIcao(originIcao, destinationIcao)
    {

        let origin = this.getAirport(originIcao);
        if (!origin) return -1;

        return this.calcDistanceLatLongIcao(origin, destinationIcao);
    }

    calcDistanceLatLongIcao(origin, destinationIcao)
    {
        let destination = this.getAirport(destinationIcao);
        if (!destination) return -1;

        return this.calcDistanceLatLong(origin, destination);
    }

    calcDistanceLatLong(origin, destination)
    {
        if (origin.lat == destination.lat && origin.lon == destination.lon)
        {
            return 0;
        }

        let distanceRadians = Math.acos(origin.latSin * destination.latSin + origin.latCos * destination.latCos * Math.cos(destination.lonRad - origin.lonRad));

        let distance =  3443.9 * distanceRadians;

        return distance;
    }

    airportsInRange(originIcao, maxDistance, candidateIcaos = undefined)
    {
        let origin = this.getAirport(originIcao);
        if (!origin) return [];

        let airportsToCheck = ICAOS;

        if (candidateIcaos && candidateIcaos.length != 0)
        {
            airportsToCheck = ICAOS.filter((airport) => candidateIcaos.includes(airport.icao));
        }

        console.log('Enter airportsInRange("' + originIcao + '", ' + maxDistance + ')...');
        let begin = new Date().getTime();
        let inRange = airportsToCheck.filter((airport) => this.calcDistanceLatLongIcao(origin, airport.icao) <= maxDistance && origin.icao != airport.icao);
        console.log('Finished airportsInRange("' + originIcao + '", ' + maxDistance + ')! Duration: ' + (new Date().getTime() - begin) + 'ms');
        
        return inRange;
    }
}

module.exports = AirportData;