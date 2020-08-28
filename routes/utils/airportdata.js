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

        return this.calcDistanceLatLongIcao(origin.lat, origin.lon, destinationIcao);
    }

    calcDistanceLatLongIcao(originLat, originLong, destinationIcao)
    {
        let destination = this.getAirport(destinationIcao);
        if (!destination) return -1;

        return this.calcDistanceLatLong(originLat, originLong, destination.lat, destination.lon);
    }

    calcDistanceLatLong(originLat, originLong, destinationLat, destinationLong)
    {
        if (originLat == destinationLat && originLong == destinationLong)
        {
            return 0;
        }

        let lat1 = originLat * (Math.PI/180);
        let long1 = originLong * (Math.PI/180);
        let lat2 = destinationLat * (Math.PI/180);
        let long2 = destinationLong * (Math.PI/180);

        let sinLat1 = Math.sin(lat1);
        let sinLat2 = Math.sin(lat2);
        let cosLat1 = Math.cos(lat1);
        let cosLat2 = Math.cos(lat2);

        let distanceRadians = Math.acos(sinLat1 * sinLat2 + cosLat1 * cosLat2 * Math.cos(long2 - long1));

        let distance =  3443.9 * distanceRadians;

        return distance;
    }

    airportsInRange(originIcao, maxDistance)
    {
        let origin = this.getAirport(originIcao);
        if (!origin) return [];

        console.log("Enter airportsInRange(originIcao, maxDistance)...");
        let begin = new Date().getTime();
        let inRange = ICAOS.filter((airport) => this.calcDistanceLatLongIcao(origin.lat, origin.lon, airport.icao) <= maxDistance && origin.icao != airport.icao);
        console.log("Finished airportsInRange(originIcao, maxDistance)! Duration: " + (new Date().getTime() - begin) + "ms");
        
        return inRange;
    }
}

module.exports = AirportData;