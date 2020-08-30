const express = require("express");
const router = express.Router();
const https = require("https");
const xml2js = require("xml2js");

class CountdownLatch
{
    constructor(counter, onCompletion, response, responseJson)
    {
        this.Counter = counter;
        this.OnCompletion = onCompletion;
        this.Response = response;
        this.ResponseJson = responseJson;
    }

    Signal()
    {
        this.Counter--;

        if (this.Counter <= 0) 
        {
            this.OnCompletion(this.Response, this.ResponseJson);
        }
    }
}

function sendResponse(res, responseJson)
{
    let airportsWithPlanes = getAirportsWithPlanes(responseJson);
    res.render('planes', { minTimeLast100hr: 95, planes: responseJson.planes, airportsWithPlanes: airportsWithPlanes, errors: responseJson.errs});
}

function filter(planes, icaos) 
{
    console.log("planes.length: " + planes.length);
    console.log("icaos.length: " + icaos.length);
    if (!icaos || icaos.length == 0) return planes;

    let filteredPlanes = planes.filter((p) => icaos.includes(p.Location[0]));
    console.log("filteredPlanes.length: " + filteredPlanes.length);
    return filteredPlanes;
}

function getAirportsWithPlanes(responseJson)
{
    if (!responseJson || !responseJson.planes) return [];

    //let airports = new Set(planes.planes.map((e) => (e.Location)));
    return responseJson.planes.reduce((acc, el) => {
        if (!acc.includes(el.Location[0])) acc.push(el.Location[0]);
        return acc;
    }, []);
}

function getPlanes(url, planeMakeModel, icaos, cdl, responseJson)
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
                    console.log("responseXml: " + responseXml.substr(0, 255));
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
                                if (result)
                                {
                                    if (result.AircraftItems)
                                    {
                                        let planes = filter(result.AircraftItems.Aircraft, icaos);

                                        if (planes)
                                        {
                                            responseJson.planes.push(...planes);
                                        }
                                    }
                                }
                            }
                        }
                    );

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
        let icaos = [];
        //let icaos = ["EDDM", "EDDK", "KSAS", "EDDW"];
        //let planesMakeModel = ["Cessna 172 Skyhawk"];
        //let planesMakeModel = ["Diamond DA20 Katana"];
        //let planesMakeModel = ["Cessna 172 Skyhawk", "Diamond DA20 Katana"];
        let planesMakeModel = ["Cessna Citation II", "Columbia 400"];
        
        let responseJson = { 
            errs: [],
            msgs: [],
            planes: []
        };

        const cdl = new CountdownLatch(planesMakeModel.length, sendResponse, res, responseJson);

        for (const pmm of planesMakeModel)
        {
            getPlanes(url, pmm, icaos, cdl, responseJson);
        }
    }
);

module.exports = router;
