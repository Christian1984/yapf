let ICAOS = require("./icaos");

class AirportData
{
    constructor()
    {
        console.log("ICAOS.length: " + ICAOS.length);
    }

    dump(icao)
    {
        let airport = ICAOS.find((e) => e.icao = icao.toUpperCase());
        return JSON.stringify(airport);
    }
}

module.exports = AirportData;