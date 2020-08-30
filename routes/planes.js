const express = require("express");
const router = express.Router();
const https = require("https");
const xml2js = require("xml2js");
const AirportData = require("./utils/airportdata");

class CountdownLatch
{
    constructor(counter, onCompletion, response, responseJson, icaos, maxDistance)
    {
        this.Counter = counter;
        this.OnCompletion = onCompletion;
        this.Response = response;
        this.ResponseJson = responseJson;
        this.Icaos = icaos;
        this.MaxDistance = maxDistance
    }

    Signal()
    {
        this.Counter--;

        if (this.Counter <= 0) 
        {
            this.OnCompletion(this.Response, this.ResponseJson, this.Icaos, this.MaxDistance);
        }
    }
}

function postProcessResultJson(responseJson, icaos, maxDistance)
{
    if (responseJson.onlyRentable)
    {
        const rentableAirplanes = responseJson.planes.filter(plane => !(plane.RentalTime == 0) && (!(plane.RentalDry == 0) || !(plane.RentalWet == 0)));
        responseJson.planes = rentableAirplanes;
    }

    const airportsWithPlanes = getAirportsWithPlanes(responseJson.planes);
    responseJson.airportsWithPlanes = airportsWithPlanes;

    const airportdata = new AirportData();

    let inRangeIcaos = [];
    for (const icao of icaos)
    {
        const airportInRangeOfIcao = airportdata.airportsInRange(icao, maxDistance, airportsWithPlanes);
        const icaosInRangeOfIcao = airportInRangeOfIcao.map((el) => el.icao);
        inRangeIcaos.push(...icaosInRangeOfIcao);
    }

    let filteredPlanes = filter(responseJson.planes, inRangeIcaos);
    responseJson.planes = filteredPlanes;
}

function sendResponse(res, responseJson, icaos, maxDistance)
{
    postProcessResultJson(responseJson, icaos, maxDistance);    
    res.render('planes', responseJson);
}

function filter(planes, icaos) 
{
    console.log("planes.length: " + planes.length);
    console.log("icaos.length: " + icaos.length);
    if (!icaos) return planes;

    let filteredPlanes = planes.filter((p) => icaos.includes(p.Location[0]));
    console.log("filteredPlanes.length: " + filteredPlanes.length);
    return filteredPlanes;
}

function getAirportsWithPlanes(planes)
{
    if (!planes) return [];

    //let airports = new Set(planes.planes.map((e) => (e.Location)));
    return planes.reduce((acc, el) => {
        if (!acc.includes(el.Location[0])) acc.push(el.Location[0]);
        return acc;
    }, []);
}

function getPlanes(url, planeMakeModel, cdl, responseJson)
{
    const path = `/data?userkey=2E87E63F0552DF38&format=json&query=aircraft&search=makemodel&makemodel=${encodeURIComponent(planeMakeModel)}`;
    
    var options = {
        host: url,
        path: path,
        method: "GET",
        headers: { }
    };

    var httpsreq = https.request(options, (response) => 
        {
            let responseXml = "";
            response.setEncoding("utf8");
            response.on("data", function (chunk)
                {
                    responseXml += chunk;
                }
            );
            response.on("end", function() 
                {
                    //console.log("responseXml: " + responseXml.substr(0, 255));

                    try 
                    {
                        xml2js.parseString(responseXml, (err, result) => 
                            {
                                if (err)
                                {
                                    console.log(err);
                                    responseJson.errs.push(err);
                                }
                                else
                                {
                                    responseJson.msgs.push(`Received data for ${planeMakeModel}`);
                                    if (result && result.AircraftItems && result.AircraftItems.Aircraft && Array.isArray(result.AircraftItems.Aircraft))
                                    {
                                        responseJson.planes.push(...result.AircraftItems.Aircraft);
                                    }
                                }
                            }
                        );
                    }
                    catch (e)
                    {
                        console.log(e);
                        responseJson.errs.push(e);
                    }

                    cdl.Signal();
                }
            );
        }
    );
    
    httpsreq.on("error", (e) => 
        {
            console.log(e);
            responseJson.errs.push(e);
            cdl.Signal();
        }
    );

    httpsreq.end();
}

/* GET planes */
router.get("/", function(req, res, next)
    {
        const url = "server.fseconomy.net";
        let maxDistance = 250;
        let minTimeLast100hr = 95;
        let onlyRentable = true;
        //let icaos = [];
        //let icaos = ["HKMT"];
        //let icaos = ["EDDK"];
        let icaos = ["EDDM", "EDDK", "KSAS", "EDDW"];
        //let planesMakeModel = ["Cessna 172 Skyhawk"];
        //let planesMakeModel = ["Diamond DA20 Katana"];
        //let planesMakeModel = ["Cessna 172 Skyhawk", "Diamond DA20 Katana"];
        let planesMakeModel = ["Cessna 172 Skyhawk", "Diamond DA20 Katana", "Cessna Citation II", "Columbia 400"];
        //let planesMakeModel = ["Cessna Citation II", "Columbia 400"];
        
        let responseJson = { 
            errs: [],
            msgs: [],
            planes: [],
            airportsWithPlanes: [],
            planesMakeModel: planesMakeModel,
            requestedIcaos: icaos,
            maxDistance: maxDistance,
            minTimeLast100hr: minTimeLast100hr,
            onlyRentable: onlyRentable
        };

        const cdl = new CountdownLatch(planesMakeModel.length, sendResponse, res, responseJson, icaos, maxDistance);

        for (const pmm of planesMakeModel)
        {
            getPlanes(url, pmm, cdl, responseJson);
        }
    }
);

module.exports = router;
